import { CareerSkillMap } from '../types/curriculum';

/**
 * CAREER SKILL MAPS for B.Tech Information Technology
 * Bridges NUC CCMAS Course Competencies, Learning Outcomes, Practical/Lecture Hours,
 * and Multi-Dimensional Skills (Knowledge, Practical Skills, Soft Skills, Tools)
 * directly to target industry roles.
 */
export const CAREER_SKILL_MAPS: Record<string, CareerSkillMap> = {
  ai_ml_engineer: {
    trackId: 'ai_ml_engineer',
    trackTitle: 'AI, Machine Learning & Intelligent Systems',
    targetRole: 'Machine Learning Engineer / AI Systems Researcher',
    description: 'Builds predictive neural networks, computer vision models, NLP pipelines, and production AI architectures following IEEE/ACM CS2023 guidelines.',
    requiredCompetencies: {
      cognitive: [
        { name: 'Linear Algebra & Optimization Theory', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Matrix decomposition, eigenvalues, gradient descent optimization' },
        { name: 'Probabilistic Reasoning & Bayesian Inference', category: 'cognitive', targetLevel: 80, weight: 0.20, description: 'Probability distributions, random variables, hypothesis testing' },
        { name: 'Deep Learning Architectural Design', category: 'cognitive', targetLevel: 85, weight: 0.30, description: 'CNN, RNN, Transformers, attention mechanisms, loss formulations' },
        { name: 'Algorithmic Complexity & Model Scalability', category: 'cognitive', targetLevel: 75, weight: 0.25, description: 'Vectorization, memory profiling, computational trade-offs' }
      ],
      technical: [
        { name: 'Neural Network Implementation & Tuning', category: 'technical', targetLevel: 90, weight: 0.30, description: 'Model training, backprop debugging, hyperparameter tuning' },
        { name: 'Data Preprocessing & Feature Engineering', category: 'technical', targetLevel: 85, weight: 0.25, description: 'Data cleansing, tokenization, embeddings, normalization' },
        { name: 'Computer Vision & NLP Pipeline Deployment', category: 'technical', targetLevel: 80, weight: 0.25, description: 'Inference pipelines, ONNX export, batch processing' },
        { name: 'Vector Database & Embedding Retrieval', category: 'technical', targetLevel: 75, weight: 0.20, description: 'RAG systems, cosine similarity search, FAISS/Pinecone indexing' }
      ],
      soft: [
        { name: 'Ethical AI & Bias Mitigation', category: 'soft', targetLevel: 80, weight: 0.35, description: 'Evaluating algorithmic fairness, data privacy, and societal impacts' },
        { name: 'Technical Research Synthesis & Presentation', category: 'soft', targetLevel: 80, weight: 0.35, description: 'Communicating experimental findings, model metrics, and limitations' },
        { name: 'Cross-Functional Engineering Collaboration', category: 'soft', targetLevel: 75, weight: 0.30, description: 'Collaborating with backend and product teams for ML integration' }
      ]
    },
    requiredSkills: {
      knowledge: [
        { name: 'Linear Algebra', category: 'knowledge', minProficiency: 80, benchmark: 'NUC MTH111 / CS2023', industryDemand: 'Critical' },
        { name: 'Probability Theory', category: 'knowledge', minProficiency: 80, benchmark: 'NUC STA121', industryDemand: 'Critical' },
        { name: 'Supervised & Unsupervised Learning', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT401', industryDemand: 'Critical' },
        { name: 'Calculus & Optimization', category: 'knowledge', minProficiency: 75, benchmark: 'MTH 211', industryDemand: 'High' }
      ],
      practical: [
        { name: 'Python Scientific Computing', category: 'practical', minProficiency: 90, benchmark: 'NumPy, Pandas, SciPy', industryDemand: 'Critical' },
        { name: 'Model Training & Evaluation', category: 'practical', minProficiency: 85, benchmark: 'F1, ROC-AUC, Loss Curve Analysis', industryDemand: 'Critical' },
        { name: 'Feature Engineering & Cleansing', category: 'practical', minProficiency: 80, benchmark: 'ETL & Vectorization', industryDemand: 'High' },
        { name: 'GPU Acceleration & CUDA Profiling', category: 'practical', minProficiency: 70, benchmark: 'TensorRT & CUDA', industryDemand: 'Moderate' }
      ],
      soft: [
        { name: 'Scientific Documentation', category: 'soft', minProficiency: 80, benchmark: 'Research Papers & Model Cards', industryDemand: 'High' },
        { name: 'Critical Problem Solving', category: 'soft', minProficiency: 85, benchmark: 'Root Cause Diagnostics', industryDemand: 'Critical' },
        { name: 'Academic & Technical Communication', category: 'soft', minProficiency: 75, benchmark: 'GST 111 / Professional Seminars', industryDemand: 'High' }
      ],
      tools: [
        { name: 'PyTorch', category: 'tools', minProficiency: 85, benchmark: 'PyTorch 2.x & TorchVision', industryDemand: 'Critical' },
        { name: 'TensorFlow / Keras', category: 'tools', minProficiency: 75, benchmark: 'TF 2.x', industryDemand: 'High' },
        { name: 'NumPy & Pandas', category: 'tools', minProficiency: 90, benchmark: 'Pandas DataFrames', industryDemand: 'Critical' },
        { name: 'HuggingFace & Transformers', category: 'tools', minProficiency: 80, benchmark: 'LLMs & Pipeline API', industryDemand: 'Critical' },
        { name: 'Jupyter & Google Colab', category: 'tools', minProficiency: 90, benchmark: 'Interactive Notebooks', industryDemand: 'High' }
      ]
    },
    targetPracticalHoursTotal: 180,
    targetLectureHoursTotal: 240
  },

  fullstack_architect: {
    trackId: 'fullstack_architect',
    trackTitle: 'Full Stack & Enterprise Software Architect',
    targetRole: 'Senior Full Stack Engineer / Enterprise Solutions Architect',
    description: 'Designs reactive frontend web systems, REST/gRPC backend microservices, transactional relational databases, and enterprise architectures.',
    requiredCompetencies: {
      cognitive: [
        { name: 'Software Architectural Patterns', category: 'cognitive', targetLevel: 90, weight: 0.30, description: 'Microservices, Monolith-to-distributed, MVC, Event-Driven' },
        { name: 'Database Normalization & Query Planning', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'ACID properties, B-Tree indexing, execution plans, CAP theorem' },
        { name: 'System Scalability & State Management', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Client vs Server state, caching strategies (Redis), CDN edge routing' },
        { name: 'Object-Oriented & Functional Design Principles', category: 'cognitive', targetLevel: 85, weight: 0.20, description: 'SOLID principles, design patterns, clean code' }
      ],
      technical: [
        { name: 'Modern Frontend Development (React/Next.js)', category: 'technical', targetLevel: 90, weight: 0.30, description: 'Component lifecycles, hooks, virtual DOM, responsive UI' },
        { name: 'REST & gRPC Microservice Backend Development', category: 'technical', targetLevel: 90, weight: 0.30, description: 'Node.js, Spring Boot/Java, API authentication (JWT, OAuth)' },
        { name: 'Relational & NoSQL Database Engineering', category: 'technical', targetLevel: 85, weight: 0.25, description: 'PostgreSQL, MongoDB, ORMs, schema migrations' },
        { name: 'Testing & Quality Assurance', category: 'technical', targetLevel: 80, weight: 0.15, description: 'Unit testing (Jest), integration testing, end-to-end automation' }
      ],
      soft: [
        { name: 'Agile & Scrum Project Leadership', category: 'soft', targetLevel: 85, weight: 0.35, description: 'Sprint planning, backlog grooming, retrospectives' },
        { name: 'Technical Architecture Documentation', category: 'soft', targetLevel: 80, weight: 0.35, description: 'C4 model diagrams, RFCs, API swagger specs' },
        { name: 'Client & Stakeholder Requirement Elicitation', category: 'soft', targetLevel: 80, weight: 0.30, description: 'Translating business needs into software requirements' }
      ]
    },
    requiredSkills: {
      knowledge: [
        { name: 'Data Structures & Algorithms', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-COS201', industryDemand: 'Critical' },
        { name: 'Database Systems Architecture', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT301', industryDemand: 'Critical' },
        { name: 'Software Engineering Principles', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT303', industryDemand: 'Critical' },
        { name: 'Operating Systems & Concurrency', category: 'knowledge', minProficiency: 75, benchmark: 'CCMAS-IFT311', industryDemand: 'High' }
      ],
      practical: [
        { name: 'TypeScript & JavaScript Programming', category: 'practical', minProficiency: 90, benchmark: 'ESNext & Type Safety', industryDemand: 'Critical' },
        { name: 'Full-Stack API Design & Implementation', category: 'practical', minProficiency: 85, benchmark: 'REST & GraphQL APIs', industryDemand: 'Critical' },
        { name: 'SQL Query Optimization', category: 'practical', minProficiency: 85, benchmark: 'Indexes, Joins, Transactions', industryDemand: 'High' },
        { name: 'State Management & Async Data Fetching', category: 'practical', minProficiency: 85, benchmark: 'Redux / TanStack Query', industryDemand: 'High' }
      ],
      soft: [
        { name: 'Team Collaboration & Code Review', category: 'soft', minProficiency: 85, benchmark: 'Pull Request Workflows', industryDemand: 'Critical' },
        { name: 'Technical Problem Solving', category: 'soft', minProficiency: 85, benchmark: 'Debugging Complex Systems', industryDemand: 'Critical' },
        { name: 'Agile Methodology', category: 'soft', minProficiency: 80, benchmark: 'Scrum/Kanban Practices', industryDemand: 'High' }
      ],
      tools: [
        { name: 'React & Tailwind CSS', category: 'tools', minProficiency: 90, benchmark: 'React 18+, Component Systems', industryDemand: 'Critical' },
        { name: 'Node.js & Express / NestJS', category: 'tools', minProficiency: 85, benchmark: 'Microservices Frameworks', industryDemand: 'Critical' },
        { name: 'PostgreSQL & MongoDB', category: 'tools', minProficiency: 85, benchmark: 'Databases & Prisma ORM', industryDemand: 'Critical' },
        { name: 'Git & GitHub', category: 'tools', minProficiency: 90, benchmark: 'Version Control & CI', industryDemand: 'Critical' },
        { name: 'Postman / Swagger', category: 'tools', minProficiency: 85, benchmark: 'API Testing & Docs', industryDemand: 'High' }
      ]
    },
    targetPracticalHoursTotal: 195,
    targetLectureHoursTotal: 225
  },

  cloud_devops_engineer: {
    trackId: 'cloud_devops_engineer',
    trackTitle: 'Cloud Solutions Architect & DevOps Engineer',
    targetRole: 'Site Reliability Engineer (SRE) / Cloud Infrastructure Architect',
    description: 'Designs automated deployment pipelines, Docker containers, Kubernetes orchestration, Infrastructure as Code with Terraform, and zero-trust cloud architectures.',
    requiredCompetencies: {
      cognitive: [
        { name: 'Distributed Systems & Cloud Fault Tolerance', category: 'cognitive', targetLevel: 85, weight: 0.30, description: 'High availability, multi-region failover, load balancing, CAP trade-offs' },
        { name: 'Linux Kernel & System Call Architecture', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Process management, namespaces, cgroups, file systems' },
        { name: 'Networking Topologies & Routing Protocols', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'TCP/IP stack, DNS, BGP, CIDR subnetting, VPC peering' },
        { name: 'Site Reliability Engineering Principles', category: 'cognitive', targetLevel: 80, weight: 0.20, description: 'SLAs, SLOs, SLIs, error budgets, blameless post-mortems' }
      ],
      technical: [
        { name: 'Containerization & Container Orchestration', category: 'technical', targetLevel: 90, weight: 0.30, description: 'Docker multi-stage builds, Kubernetes pods, deployments, ingress, Helm' },
        { name: 'CI/CD Pipeline Engineering & Automation', category: 'technical', targetLevel: 90, weight: 0.30, description: 'GitHub Actions, GitLab CI, automated testing, artifact publishing' },
        { name: 'Infrastructure as Code (IaC) & Cloud Provisioning', category: 'technical', targetLevel: 85, weight: 0.25, description: 'Terraform modules, AWS CloudFormation, immutable infrastructure' },
        { name: 'Observability, Logging & Alerting', category: 'technical', targetLevel: 80, weight: 0.15, description: 'Prometheus metrics, Grafana dashboards, ELK/Loki log aggregation' }
      ],
      soft: [
        { name: 'Incident Management & Crisis Communication', category: 'soft', targetLevel: 85, weight: 0.35, description: 'Handling production outages, root cause analysis, on-call coordination' },
        { name: 'Security Compliance & Governance', category: 'soft', targetLevel: 80, weight: 0.35, description: 'NDPR, SOC2, zero-trust access, least privilege principles' },
        { name: 'Developer Enablement & Mentorship', category: 'soft', targetLevel: 75, weight: 0.30, description: 'Improving developer experience (DevEx) and self-service infra' }
      ]
    },
    requiredSkills: {
      knowledge: [
        { name: 'Operating Systems & Linux Internals', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT311', industryDemand: 'Critical' },
        { name: 'Computer Networks & TCP/IP', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT302', industryDemand: 'Critical' },
        { name: 'Cloud Computing Architecture', category: 'knowledge', minProficiency: 85, benchmark: 'IEEE/ACM Platform Tech', industryDemand: 'Critical' },
        { name: 'Information Security & Identity Management', category: 'knowledge', minProficiency: 80, benchmark: 'CCMAS-IFT402', industryDemand: 'High' }
      ],
      practical: [
        { name: 'Shell Scripting (Bash/Zsh)', category: 'practical', minProficiency: 90, benchmark: 'Linux CLI & Automation', industryDemand: 'Critical' },
        { name: 'Kubernetes Cluster Management', category: 'practical', minProficiency: 85, benchmark: 'CKA/CKAD standards', industryDemand: 'Critical' },
        { name: 'Infrastructure as Code (Terraform)', category: 'practical', minProficiency: 85, benchmark: 'HCL & State Management', industryDemand: 'Critical' },
        { name: 'Continuous Delivery Pipelines', category: 'practical', minProficiency: 90, benchmark: 'Automated Releases & Rollbacks', industryDemand: 'Critical' }
      ],
      soft: [
        { name: 'Incident Response & Post-Mortem Writing', category: 'soft', minProficiency: 80, benchmark: 'SRE Best Practices', industryDemand: 'High' },
        { name: 'Systematic Troubleshooting', category: 'soft', minProficiency: 90, benchmark: 'Root Cause Isolation', industryDemand: 'Critical' },
        { name: 'Cross-Team Operational Support', category: 'soft', minProficiency: 80, benchmark: 'DevOps Culture', industryDemand: 'High' }
      ],
      tools: [
        { name: 'Docker & Podman', category: 'tools', minProficiency: 90, benchmark: 'Containers', industryDemand: 'Critical' },
        { name: 'Kubernetes & Helm', category: 'tools', minProficiency: 85, benchmark: 'Orchestration', industryDemand: 'Critical' },
        { name: 'GitHub Actions / GitLab CI', category: 'tools', minProficiency: 90, benchmark: 'CI/CD Pipelines', industryDemand: 'Critical' },
        { name: 'Terraform & Ansible', category: 'tools', minProficiency: 85, benchmark: 'IaC Tools', industryDemand: 'Critical' },
        { name: 'AWS / GCP / Azure', category: 'tools', minProficiency: 85, benchmark: 'Public Cloud Services', industryDemand: 'Critical' },
        { name: 'Prometheus & Grafana', category: 'tools', minProficiency: 80, benchmark: 'Monitoring Stack', industryDemand: 'High' }
      ]
    },
    targetPracticalHoursTotal: 210,
    targetLectureHoursTotal: 210
  },

  cybersecurity_specialist: {
    trackId: 'cybersecurity_specialist',
    trackTitle: 'Cybersecurity & Defense Engineer',
    targetRole: 'Information Security Officer / Security Analyst & Ethical Hacker',
    description: 'Secures enterprise networks and applications, implements cryptographic protocols, performs penetration testing, conducts digital forensic investigations, and enforces NDPR compliance.',
    requiredCompetencies: {
      cognitive: [
        { name: 'Threat Modeling & Attack Vector Analysis', category: 'cognitive', targetLevel: 90, weight: 0.30, description: 'STRIDE, MITRE ATT&CK framework, risk assessment' },
        { name: 'Applied Cryptography & PKI Protocols', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'AES, RSA, ECC, Diffie-Hellman, digital certificates, TLS 1.3' },
        { name: 'Network Defense & Protocol Security', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Firewall rules, IDS/IPS, packet inspection, VPN tunneling' },
        { name: 'Security Governance, NDPR & Cyber Laws', category: 'cognitive', targetLevel: 80, weight: 0.20, description: 'Nigerian Data Protection Regulation (NDPR), ISO 27001' }
      ],
      technical: [
        { name: 'Penetration Testing & Vulnerability Assessment', category: 'technical', targetLevel: 90, weight: 0.30, description: 'OWASP Top 10, Kali Linux, Metasploit, Burp Suite, exploit analysis' },
        { name: 'Network Traffic Analysis & Packet Forensics', category: 'technical', targetLevel: 85, weight: 0.25, description: 'Wireshark, tcpdump, anomaly detection, intrusion hunting' },
        { name: 'Secure Code Auditing & DevSecOps', category: 'technical', targetLevel: 85, weight: 0.25, description: 'SAST, DAST, dependency scanning, secret management' },
        { name: 'Digital Forensics & Incident Investigation', category: 'technical', targetLevel: 80, weight: 0.20, description: 'Memory dumping, disk imaging (Autopsy/FTK), chain of custody' }
      ],
      soft: [
        { name: 'Professional Ethics & Legal Disclosures', category: 'soft', targetLevel: 95, weight: 0.40, description: 'Responsible vulnerability disclosure, ethical hacking conduct' },
        { name: 'Executive Security Reporting', category: 'soft', targetLevel: 80, weight: 0.30, description: 'Translating technical CVEs into executive business risk impacts' },
        { name: 'Security Awareness Training & Mentoring', category: 'soft', targetLevel: 75, weight: 0.30, description: 'Educating organizational users against phishing and social engineering' }
      ]
    },
    requiredSkills: {
      knowledge: [
        { name: 'Computer Networks & Internet Protocols', category: 'knowledge', minProficiency: 90, benchmark: 'CCMAS-IFT302', industryDemand: 'Critical' },
        { name: 'Cryptography & Information Security', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT402', industryDemand: 'Critical' },
        { name: 'Operating System Security & Access Controls', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT311', industryDemand: 'Critical' },
        { name: 'Cyber Laws, NDPR & Ethics', category: 'knowledge', minProficiency: 80, benchmark: 'CCMAS-GST223', industryDemand: 'High' }
      ],
      practical: [
        { name: 'Vulnerability Scanning & Penetration Testing', category: 'practical', minProficiency: 85, benchmark: 'Ethical Hacking Labs', industryDemand: 'Critical' },
        { name: 'Packet Analysis & Threat Detection', category: 'practical', minProficiency: 85, benchmark: 'Wireshark Analysis', industryDemand: 'Critical' },
        { name: 'Digital Evidence Extraction', category: 'practical', minProficiency: 80, benchmark: 'Forensic Lab Procedures', industryDemand: 'High' },
        { name: 'Cryptographic Implementation (OpenSSL/Python)', category: 'practical', minProficiency: 80, benchmark: 'Key & Certificate Management', industryDemand: 'High' }
      ],
      soft: [
        { name: 'Ethical Integrity & Compliance', category: 'soft', minProficiency: 95, benchmark: 'Professional Code of Conduct', industryDemand: 'Critical' },
        { name: 'Clear Security Risk Reporting', category: 'soft', minProficiency: 85, benchmark: 'Audit Reports', industryDemand: 'Critical' },
        { name: 'High-Pressure Decision Making', category: 'soft', minProficiency: 80, benchmark: 'Active Breach Containment', industryDemand: 'High' }
      ],
      tools: [
        { name: 'Kali Linux & Metasploit', category: 'tools', minProficiency: 85, benchmark: 'Security OS & Frameworks', industryDemand: 'Critical' },
        { name: 'Wireshark & Nmap', category: 'tools', minProficiency: 90, benchmark: 'Network Diagnostics', industryDemand: 'Critical' },
        { name: 'Burp Suite & OWASP ZAP', category: 'tools', minProficiency: 85, benchmark: 'Web App Security', industryDemand: 'Critical' },
        { name: 'OpenSSL & GnuPG', category: 'tools', minProficiency: 80, benchmark: 'Cryptography CLI', industryDemand: 'High' },
        { name: 'Autopsy / FTK Imager', category: 'tools', minProficiency: 75, benchmark: 'Digital Forensics', industryDemand: 'High' }
      ]
    },
    targetPracticalHoursTotal: 195,
    targetLectureHoursTotal: 225
  },

  data_engineer: {
    trackId: 'data_engineer',
    trackTitle: 'Big Data & Analytics Systems Engineer',
    targetRole: 'Data Engineer / Analytics Pipeline Architect',
    description: 'Builds enterprise data warehouses, real-time distributed streaming ETL pipelines with Kafka and Spark, and manages distributed databases for predictive analytics.',
    requiredCompetencies: {
      cognitive: [
        { name: 'Distributed Data Storage & Partitioning', category: 'cognitive', targetLevel: 90, weight: 0.30, description: 'HDFS, S3 data lakes, columnar storage (Parquet/ORC), sharding' },
        { name: 'Data Modeling & Dimensional Schemas', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Star schema, Snowflake schema, Data Vault, slowly changing dimensions' },
        { name: 'Stream Processing vs Batch Processing', category: 'cognitive', targetLevel: 85, weight: 0.25, description: 'Event time processing, watermarks, lambda vs kappa architectures' },
        { name: 'Data Governance & Data Quality Management', category: 'cognitive', targetLevel: 80, weight: 0.20, description: 'Data lineage, schema evolution, Great Expectations, data catalogs' }
      ],
      technical: [
        { name: 'Distributed Data Processing (Apache Spark)', category: 'technical', targetLevel: 90, weight: 0.30, description: 'PySpark, Spark SQL, DataFrame optimizations, catalyst optimizer' },
        { name: 'Data Pipeline Orchestration & Workflow Scheduling', category: 'technical', targetLevel: 90, weight: 0.30, description: 'Apache Airflow DAGs, Prefect, automated retries and backfills' },
        { name: 'Advanced SQL & Data Warehouse Engineering', category: 'technical', targetLevel: 90, weight: 0.25, description: 'Snowflake, BigQuery, complex window functions, materialized views' },
        { name: 'Real-time Event Streaming (Apache Kafka)', category: 'technical', targetLevel: 80, weight: 0.15, description: 'Producers, consumers, topic partitions, schema registry' }
      ],
      soft: [
        { name: 'Data Storytelling & Cross-Team Analytics', category: 'soft', targetLevel: 80, weight: 0.35, description: 'Communicating data availability and SLA metrics to data science teams' },
        { name: 'Data Privacy & Regulatory Compliance', category: 'soft', targetLevel: 85, weight: 0.35, description: 'Data anonymization, PII masking under NDPR and GDPR' },
        { name: 'Agile Pipeline Development', category: 'soft', targetLevel: 75, weight: 0.30, description: 'Continuous integration for data pipelines (DataOps)' }
      ]
    },
    requiredSkills: {
      knowledge: [
        { name: 'Database Management Systems', category: 'knowledge', minProficiency: 90, benchmark: 'CCMAS-IFT301', industryDemand: 'Critical' },
        { name: 'Big Data Processing & Distributed Systems', category: 'knowledge', minProficiency: 85, benchmark: 'CCMAS-IFT404', industryDemand: 'Critical' },
        { name: 'Data Structures & Algorithms', category: 'knowledge', minProficiency: 80, benchmark: 'CCMAS-COS201', industryDemand: 'Critical' },
        { name: 'Applied Statistics & Probability', category: 'knowledge', minProficiency: 75, benchmark: 'CCMAS-STA102', industryDemand: 'High' }
      ],
      practical: [
        { name: 'Advanced SQL Querying & Tuning', category: 'practical', minProficiency: 95, benchmark: 'Window Functions, CTEs, Indexing', industryDemand: 'Critical' },
        { name: 'Python Data Engineering (Pandas/PySpark)', category: 'practical', minProficiency: 90, benchmark: 'DataFrame Pipelines', industryDemand: 'Critical' },
        { name: 'ETL / ELT Pipeline Development', category: 'practical', minProficiency: 90, benchmark: 'Airflow & Batch Scripts', industryDemand: 'Critical' },
        { name: 'Data Warehousing & Dimensional Modeling', category: 'practical', minProficiency: 85, benchmark: 'Star Schema Design', industryDemand: 'Critical' }
      ],
      soft: [
        { name: 'Analytical Thinking & Data Rigor', category: 'soft', minProficiency: 90, benchmark: 'Data Consistency Verification', industryDemand: 'Critical' },
        { name: 'Clear Technical Documentation', category: 'soft', minProficiency: 80, benchmark: 'Data Dictionaries & Catalogs', industryDemand: 'High' },
        { name: 'Collaborative Problem Solving', category: 'soft', minProficiency: 80, benchmark: 'Cross-functional Support', industryDemand: 'High' }
      ],
      tools: [
        { name: 'SQL (PostgreSQL / MySQL)', category: 'tools', minProficiency: 95, benchmark: 'Relational DBs', industryDemand: 'Critical' },
        { name: 'Apache Spark & PySpark', category: 'tools', minProficiency: 85, benchmark: 'Distributed Compute', industryDemand: 'Critical' },
        { name: 'Apache Airflow', category: 'tools', minProficiency: 85, benchmark: 'Workflow Orchestration', industryDemand: 'Critical' },
        { name: 'Snowflake / BigQuery / Redshift', category: 'tools', minProficiency: 80, benchmark: 'Cloud Data Warehouses', industryDemand: 'Critical' },
        { name: 'Apache Kafka / RabbitMQ', category: 'tools', minProficiency: 75, benchmark: 'Event Streaming', industryDemand: 'High' },
        { name: 'dbt (data build tool)', category: 'tools', minProficiency: 80, benchmark: 'Data Transformation', industryDemand: 'High' }
      ]
    },
    targetPracticalHoursTotal: 195,
    targetLectureHoursTotal: 225
  }
};
