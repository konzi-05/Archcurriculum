import { 
  Course, 
  CourseTimeSlot, 
  TimetableDay, 
  ScheduleConflict, 
  ScheduleAuditReport, 
  ConflictType, 
  ConflictSeverity 
} from '../types/curriculum';

export const TIMETABLE_DAYS: TimetableDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const STANDARD_TIME_SLOTS = [
  { startTime: '09:00', endTime: '10:00', label: '09:00 - 10:00', type: 'Lecture' as const },
  { startTime: '10:00', endTime: '11:00', label: '10:00 - 11:00', type: 'Lecture' as const },
  { startTime: '11:15', endTime: '12:15', label: '11:15 - 12:15', type: 'Lecture' as const },
  { startTime: '12:15', endTime: '13:15', label: '12:15 - 13:15 (Lunch / Break)', type: 'Break' as const },
  { startTime: '13:15', endTime: '15:15', label: '13:15 - 15:15 (Practical Lab)', type: 'Lab' as const },
  { startTime: '15:30', endTime: '17:00', label: '15:30 - 17:00 (Self-Study / Workshop)', type: 'Tutorial' as const }
];

const VENUES = [
  'LT-1 (Lecture Theatre 1)',
  'LT-2 (Lecture Theatre 2)',
  'SICT Computer Lab 1',
  'SICT Computing Lab 2',
  'ETF Hall B (Auditorium)',
  'Cybersecurity & Network Lab',
  'Software Engineering Studio',
  'Room 204 (SICT Block A)'
];

/**
 * Deterministic schedule slot generator for a given course.
 * Ensures consistent schedule times and realistic lab/lecture slots for all 40+ courses.
 */
export function getCourseScheduleSlots(course: Course): CourseTimeSlot[] {
  if (course.scheduleSlots && course.scheduleSlots.length > 0) {
    return course.scheduleSlots;
  }

  // Create hash code from course id & code
  const codeSum = (course.code + course.id).split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  
  const slots: CourseTimeSlot[] = [];
  const primaryDayIdx = codeSum % 5;
  const secondaryDayIdx = (codeSum + 2) % 5;
  
  const primaryDay = TIMETABLE_DAYS[primaryDayIdx];
  const secondaryDay = TIMETABLE_DAYS[secondaryDayIdx];

  const venueIdx = codeSum % VENUES.length;
  const labVenueIdx = (codeSum + 3) % VENUES.length;

  const isLabCourse = course.type === 'Lab' || course.practicalHours >= 2;
  const hasMultipleLectures = course.lectureHours >= 3 || course.credits >= 3;

  // Primary Lecture Slot
  const slotIdx = (codeSum + course.semester) % 3; // 0: 09:00, 1: 10:00, 2: 11:15
  const primarySlot = STANDARD_TIME_SLOTS[slotIdx];

  slots.push({
    id: `${course.id}-slot-1`,
    day: primaryDay,
    startTime: primarySlot.startTime,
    endTime: primarySlot.endTime,
    slotLabel: primarySlot.label,
    type: 'Lecture',
    venue: VENUES[venueIdx]
  });

  // Secondary Lecture or Discussion Slot if high credit/hours
  if (hasMultipleLectures) {
    const secSlotIdx = (codeSum + 1) % 3;
    const secSlot = STANDARD_TIME_SLOTS[secSlotIdx];
    slots.push({
      id: `${course.id}-slot-2`,
      day: secondaryDay,
      startTime: secSlot.startTime,
      endTime: secSlot.endTime,
      slotLabel: secSlot.label,
      type: 'Lecture',
      venue: VENUES[(venueIdx + 1) % VENUES.length]
    });
  }

  // Practical Laboratory Slot for Lab & Hands-on units
  if (isLabCourse) {
    const labDayIdx = (codeSum + 3) % 5;
    const labDay = TIMETABLE_DAYS[labDayIdx];
    slots.push({
      id: `${course.id}-slot-lab`,
      day: labDay,
      startTime: '13:15',
      endTime: '15:15',
      slotLabel: '13:15 - 15:15 (Practical Lab)',
      type: 'Lab',
      venue: VENUES[labVenueIdx].includes('Lab') ? VENUES[labVenueIdx] : 'SICT Computing Lab 2'
    });
  }

  return slots;
}

/**
 * Core Algorithm: Automatically detects all timetable clashes, time-slot collisions,
 * semester discrepancies, and prerequisite co-enrollment errors.
 */
export function detectScheduleConflicts(
  selectedCourses: Course[],
  activeSemester: number,
  customSemesterMap: Record<string, number> = {}
): ScheduleAuditReport {
  const conflicts: ScheduleConflict[] = [];
  const clashedCourseIds = new Set<string>();

  if (selectedCourses.length === 0) {
    return {
      hasConflicts: false,
      totalConflicts: 0,
      criticalCount: 0,
      warningCount: 0,
      conflicts: [],
      timeSlotClashes: [],
      semesterMismatches: [],
      prereqClashes: [],
      clashedCourseIds: [],
      dayWorkloads: {
        Monday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
        Tuesday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
        Wednesday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
        Thursday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
        Friday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false }
      }
    };
  }

  // Map each course to its slots
  const courseSlotsMap = new Map<string, { course: Course; slots: CourseTimeSlot[] }>();
  selectedCourses.forEach(course => {
    const slots = getCourseScheduleSlots(course);
    courseSlotsMap.set(course.id, { course, slots });
  });

  // =========================================================================
  // 1. TIME SLOT CLASH DETECTION (Day + Time Slot Collisions)
  // =========================================================================
  const slotOccupancy = new Map<string, { course: Course; slot: CourseTimeSlot }[]>();

  courseSlotsMap.forEach(({ course, slots }) => {
    slots.forEach(slot => {
      const key = `${slot.day}__${slot.startTime}__${slot.endTime}`;
      const existing = slotOccupancy.get(key) || [];
      existing.push({ course, slot });
      slotOccupancy.set(key, existing);
    });
  });

  slotOccupancy.forEach((occupants, key) => {
    if (occupants.length > 1) {
      const [day, startTime, endTime] = key.split('__');
      const timeLabel = `${startTime} - ${endTime}`;
      const courseCodes = occupants.map(o => o.course.code);
      const courseIds = occupants.map(o => o.course.id);
      const courseNames = occupants.map(o => o.course.name);

      courseIds.forEach(id => clashedCourseIds.add(id));

      const hasLab = occupants.some(o => o.slot.type === 'Lab');

      conflicts.push({
        id: `clash-timeslot-${key}`,
        type: 'TIME_SLOT_CLASH',
        severity: 'CRITICAL',
        title: `Time Slot Collision: ${day} (${timeLabel})`,
        description: `Multiple enrolled courses (${courseCodes.join(' & ')}) are simultaneously scheduled on ${day} from ${timeLabel}. Attending both classes is physically impossible.`,
        courseIds,
        courseCodes,
        day: day as TimetableDay,
        timeSlot: timeLabel,
        venue: occupants.map(o => `${o.course.code}: ${o.slot.venue || 'Classroom'}`).join(' | '),
        resolutionTip: hasLab 
          ? `Move either ${courseCodes[0]} or ${courseCodes[1]} to another semester block or replace the elective with an alternate career track elective.`
          : `Switch elective selection or consult your academic advisor to take one of these courses in a future semester.`
      });
    }
  });

  // =========================================================================
  // 2. CROSS-SEMESTER & SEASONALITY MISMATCH DETECTION
  // =========================================================================
  const isActiveOdd = activeSemester % 2 !== 0; // Odd = Harmattan, Even = Rain
  const activeSeasonLabel = isActiveOdd ? 'Harmattan (Odd Semester)' : 'Rain (Even Semester)';
  const courseSemesterRecord: Record<string, number> = {};
  const seasonMismatchCourses: Course[] = [];
  const levelSpreadCourses: Course[] = [];

  selectedCourses.forEach(course => {
    const effectiveSemester = customSemesterMap[course.id] ?? course.semester;
    courseSemesterRecord[course.code] = effectiveSemester;

    const isCourseOdd = effectiveSemester % 2 !== 0;

    // Check Harmattan vs Rain season mismatch
    if (isActiveOdd !== isCourseOdd) {
      seasonMismatchCourses.push(course);
      clashedCourseIds.add(course.id);
    }

    // Check if course belongs to a different semester entirely
    if (effectiveSemester !== activeSemester) {
      levelSpreadCourses.push(course);
      clashedCourseIds.add(course.id);
    }
  });

  if (seasonMismatchCourses.length > 0) {
    const codes = seasonMismatchCourses.map(c => c.code);
    const ids = seasonMismatchCourses.map(c => c.id);

    conflicts.push({
      id: `clash-seasonality-mismatch`,
      type: 'CROSS_SEMESTER_MISMATCH',
      severity: 'CRITICAL',
      title: `Harmattan / Rain Seasonality Clash (${codes.join(', ')})`,
      description: `Active enrollment is set to Semester ${activeSemester} (${activeSeasonLabel}), but ${codes.join(', ')} is strictly a ${isActiveOdd ? 'Rain (Even)' : 'Harmattan (Odd)'} course. Nigerian university regulations prohibit cross-season course registration.`,
      courseIds: ids,
      courseCodes: codes,
      semesterDiscrepancy: {
        activeSemester,
        courseSemesters: courseSemesterRecord
      },
      resolutionTip: `Remove ${codes.join(', ')} from Semester ${activeSemester} and plan it for ${isActiveOdd ? 'an Even (Rain)' : 'an Odd (Harmattan)'} semester.`
    });
  }

  // Multi-semester spread warning
  const uniqueSemesters = Array.from(new Set(selectedCourses.map(c => customSemesterMap[c.id] ?? c.semester)));
  if (uniqueSemesters.length > 1 && seasonMismatchCourses.length === 0) {
    const outlierCourses = selectedCourses.filter(c => (customSemesterMap[c.id] ?? c.semester) !== activeSemester);
    const codes = outlierCourses.map(c => c.code);
    const ids = outlierCourses.map(c => c.id);

    conflicts.push({
      id: `clash-multi-semester-spread`,
      type: 'MULTI_SEMESTER_SPREAD',
      severity: 'WARNING',
      title: `Multi-Semester Course Spread (${uniqueSemesters.map(s => `Sem ${s}`).join(', ')})`,
      description: `Your active plan contains subjects spanning multiple academic semesters (${uniqueSemesters.join(', ')}). While carrying over outstanding courses is permitted, it frequently creates timetable overlaps.`,
      courseIds: ids,
      courseCodes: codes,
      semesterDiscrepancy: {
        activeSemester,
        courseSemesters: courseSemesterRecord
      },
      resolutionTip: `Verify that outstanding carryover courses do not clash with department core lectures on the weekly timetable.`
    });
  }

  // =========================================================================
  // 3. PREREQUISITE CO-ENROLLMENT CLASH DETECTION
  // =========================================================================
  selectedCourses.forEach(course => {
    if (course.prerequisites && course.prerequisites.length > 0) {
      course.prerequisites.forEach(prereqIdOrCode => {
        const foundPrereqInPlan = selectedCourses.find(
          c => c.id === prereqIdOrCode || c.code.toLowerCase() === prereqIdOrCode.toLowerCase()
        );

        if (foundPrereqInPlan) {
          clashedCourseIds.add(course.id);
          clashedCourseIds.add(foundPrereqInPlan.id);

          conflicts.push({
            id: `clash-prereq-${course.id}-${foundPrereqInPlan.id}`,
            type: 'PREREQUISITE_CO_ENROLLMENT',
            severity: 'CRITICAL',
            title: `Prerequisite Co-Enrollment: ${course.code} requires ${foundPrereqInPlan.code}`,
            description: `You have selected both ${foundPrereqInPlan.code} (${foundPrereqInPlan.name}) and its advanced follow-up ${course.code} (${course.name}) in the same semester. A prerequisite must be passed first before taking the subsequent course.`,
            courseIds: [course.id, foundPrereqInPlan.id],
            courseCodes: [course.code, foundPrereqInPlan.code],
            resolutionTip: `Complete ${foundPrereqInPlan.code} in the current semester and defer ${course.code} to a subsequent term.`
          });
        }
      });
    }
  });

  // =========================================================================
  // 4. DAILY WORKLOAD & LAB OVERLOAD DETECTION
  // =========================================================================
  const dayWorkloads: Record<TimetableDay, { contactHours: number; lectureCount: number; labCount: number; hasLabOverload: boolean }> = {
    Monday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
    Tuesday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
    Wednesday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
    Thursday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false },
    Friday: { contactHours: 0, lectureCount: 0, labCount: 0, hasLabOverload: false }
  };

  selectedCourses.forEach(course => {
    const slots = getCourseScheduleSlots(course);
    slots.forEach(slot => {
      const dur = slot.type === 'Lab' ? 2 : 1;
      const targetDay = dayWorkloads[slot.day];
      if (targetDay) {
        targetDay.contactHours += dur;
        if (slot.type === 'Lab') targetDay.labCount += 1;
        else targetDay.lectureCount += 1;
      }
    });
  });

  TIMETABLE_DAYS.forEach(day => {
    const dw = dayWorkloads[day];
    if (dw.labCount >= 2) {
      dw.hasLabOverload = true;
      conflicts.push({
        id: `clash-lab-overload-${day}`,
        type: 'DAILY_LAB_OVERLOAD',
        severity: 'WARNING',
        title: `Heavy Practical Lab Overload on ${day}`,
        description: `You have ${dw.labCount} separate 2-hour laboratory practical sessions scheduled on ${day} (${dw.contactHours} total contact hours), which may cause cognitive fatigue and project deadline pressure.`,
        courseIds: selectedCourses.filter(c => getCourseScheduleSlots(c).some(s => s.day === day && s.type === 'Lab')).map(c => c.id),
        courseCodes: selectedCourses.filter(c => getCourseScheduleSlots(c).some(s => s.day === day && s.type === 'Lab')).map(c => c.code),
        day,
        resolutionTip: `Spread elective labs across alternate days if departmental section scheduling permits.`
      });
    }
  });

  const criticalCount = conflicts.filter(c => c.severity === 'CRITICAL').length;
  const warningCount = conflicts.filter(c => c.severity === 'WARNING').length;

  return {
    hasConflicts: conflicts.length > 0,
    totalConflicts: conflicts.length,
    criticalCount,
    warningCount,
    conflicts,
    timeSlotClashes: conflicts.filter(c => c.type === 'TIME_SLOT_CLASH'),
    semesterMismatches: conflicts.filter(c => c.type === 'CROSS_SEMESTER_MISMATCH' || c.type === 'MULTI_SEMESTER_SPREAD'),
    prereqClashes: conflicts.filter(c => c.type === 'PREREQUISITE_CO_ENROLLMENT'),
    clashedCourseIds: Array.from(clashedCourseIds),
    dayWorkloads
  };
}

/**
 * Formats a clean timetable cell matrix for the weekly grid view
 */
export interface TimetableCellOccupant {
  course: Course;
  slot: CourseTimeSlot;
  isClashing: boolean;
  clashingWithCodes: string[];
}

export interface TimetableGridMatrix {
  timeSlots: typeof STANDARD_TIME_SLOTS;
  days: TimetableDay[];
  matrix: Record<string, Record<TimetableDay, TimetableCellOccupant[]>>;
}

export function buildTimetableGridMatrix(selectedCourses: Course[]): TimetableGridMatrix {
  const matrix: Record<string, Record<TimetableDay, TimetableCellOccupant[]>> = {};

  STANDARD_TIME_SLOTS.forEach(ts => {
    matrix[ts.label] = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };
  });

  selectedCourses.forEach(course => {
    const slots = getCourseScheduleSlots(course);
    slots.forEach(slot => {
      const matchingStandardSlot = STANDARD_TIME_SLOTS.find(
        ts => ts.startTime === slot.startTime || ts.label.includes(slot.startTime)
      );

      if (matchingStandardSlot) {
        const currentOccupants = matrix[matchingStandardSlot.label][slot.day];
        currentOccupants.push({
          course,
          slot,
          isClashing: false, // will update below
          clashingWithCodes: []
        });
      }
    });
  });

  // Mark clashing entries
  STANDARD_TIME_SLOTS.forEach(ts => {
    TIMETABLE_DAYS.forEach(day => {
      const occupants = matrix[ts.label][day];
      if (occupants.length > 1) {
        const allCodes = occupants.map(o => o.course.code);
        occupants.forEach(o => {
          o.isClashing = true;
          o.clashingWithCodes = allCodes.filter(c => c !== o.course.code);
        });
      }
    });
  });

  return {
    timeSlots: STANDARD_TIME_SLOTS,
    days: TIMETABLE_DAYS,
    matrix
  };
}
