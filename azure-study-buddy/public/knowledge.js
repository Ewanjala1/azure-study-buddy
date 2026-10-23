// Azure Study Buddy - Curated Knowledge & Intelligent Answer Engine
// Covers AZ-900 (Azure Fundamentals), AI-900 (Azure AI Fundamentals), and general cloud concepts.

const TOPICS = {
  "resource group": {
    title: "Azure Resource Group",
    eli12: {
      analogy: "Like a labeled plastic storage bin where you keep all Lego pieces for a single castle. When you finish, dumping the bin cleans up everything at once.",
      definition: "A digital container in Azure where you group related resources (like virtual servers, storage, and networks) so you can manage them as a single project.",
      exam_tip: "Deleting a resource group permanently deletes every resource inside it. A resource can only be in one resource group at a time.",
    },
    normal: {
      analogy: "Like a folder on your computer that organizes all files belonging to one project, allowing you to move, secure, or delete them collectively.",
      definition: "A logical container in Microsoft Azure that holds related resources for an Azure solution. It manages their lifecycle, access control, and billing boundaries.",
      exam_tip: "Resources from different regions can live in the same resource group. You can deploy resources across multiple groups using ARM or Bicep templates.",
    },
    exam: {
      analogy: "Like an administrative boundary unit enforcing consistent lifecycle, role assignments (RBAC), and policy compliance across dependent cloud assets.",
      definition: "A container that holds related resources for an Azure solution. A resource can exist in only one resource group, can be moved between groups, and shares the group lifecycle.",
      exam_tip: "AZ-900 trap: Resource groups cannot be nested. Deleting a resource group deletes all child resources without exception.",
    },
    check: {
      q: "What happens when an administrator deletes an Azure Resource Group?",
      options: [
        "Only the virtual machines are deleted; storage disks are retained",
        "All resources contained within that resource group are permanently deleted",
        "Resources are automatically migrated to the subscription default group"
      ],
      answer: 1,
      why: "Deleting a resource group cascades deletion to every resource inside it, making lifecycle cleanup fast and total."
    }
  },

  "availability zones": {
    title: "Availability Zones",
    eli12: {
      analogy: "Like having three separate school buildings in your town with their own power generators. If lightning knocks out one building, class continues in the other two.",
      definition: "Physically separated data centers within the same Azure geographic area, each with its own electricity, cooling, and internet lines.",
      exam_tip: "Each supported region has a minimum of three separate availability zones to guarantee high availability.",
    },
    normal: {
      analogy: "Like having multiple bank branches across a city running synchronized records; an outage at one branch never disrupts customer transactions.",
      definition: "Physically unique locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking infrastructure.",
      exam_tip: "Deploying VMs across availability zones provides a 99.99% uptime Service Level Agreement (SLA) from Microsoft.",
    },
    exam: {
      analogy: "Like isolated fault and update domains distributed over low-latency optical interconnects within a single metropolitan boundary.",
      definition: "High-availability offering that protects applications and data from datacenter failures. Comprises a minimum of 3 independent zones per enabled region connected via high-speed fiber.",
      exam_tip: "AZ-900 trap: Availability Zones protect against datacenter failures within a region, NOT entire regional disasters. For regional disasters, use Region Pairs.",
    },
    check: {
      q: "What is the minimum number of Availability Zones present in an Azure region that supports them?",
      options: [
        "1 zone",
        "2 zones",
        "3 zones"
      ],
      answer: 2,
      why: "Azure regions that support Availability Zones are designed with at least three physically distinct, independent zones."
    }
  },

  "azure blob storage": {
    title: "Azure Blob Storage",
    eli12: {
      analogy: "Like a giant bottomless digital toy chest where you can throw any photo, video, or music file, and grab it whenever you need with a special internet link.",
      definition: "Microsoft's cloud storage service designed to store massive amounts of unstructured data like images, audio, video, documents, and backups.",
      exam_tip: "Blob storage has 4 access tiers: Hot (active), Cool (infrequent), Cold (rare), and Archive (offline backup with lowest cost).",
    },
    normal: {
      analogy: "Like a secure cloud drive built specifically for web-scale files and documents rather than traditional computer folder hierarchies.",
      definition: "Massively scalable object storage for unstructured data. Ideal for serving images to browsers, storing files for distributed access, streaming video, and data lakes.",
      exam_tip: "Archive tier offers the lowest storage cost but data is offline and takes hours to rehydrate before you can read it.",
    },
    exam: {
      analogy: "Like an object storage repository supporting block blobs, append blobs, and page blobs with lifecycle management and immutable WORM policies.",
      definition: "Object storage platform optimized for massive unstructured workloads. Supports Hot, Cool (30-day min), Cold (90-day min), and Archive (180-day min) lifecycle tiers.",
      exam_tip: "AZ-900 trap: Blob access tiers can be set at the account or individual blob level. Moving to Archive tier makes data inaccessible until rehydrated.",
    },
    check: {
      q: "Which Azure Blob Storage access tier offers the lowest storage price but requires several hours to retrieve data?",
      options: [
        "Cool tier",
        "Archive tier",
        "Cold tier"
      ],
      answer: 1,
      why: "Archive tier is the most cost-effective for long-term backup data, but objects must be rehydrated before they can be read."
    }
  },

  "shared responsibility model": {
    title: "Shared Responsibility Model",
    eli12: {
      analogy: "Like renting an apartment: the building owner fixes the roof and elevators, but you are responsible for locking your door and keeping your personal things safe.",
      definition: "A set of clear rules showing what security and maintenance jobs belong to Microsoft and what jobs belong to you when using the cloud.",
      exam_tip: "In all cloud models (IaaS, PaaS, SaaS), you (the customer) are ALWAYS responsible for your data and user identities.",
    },
    normal: {
      analogy: "Like leasing a car: the leasing company handles manufacturer safety recalls, while you are responsible for fuel, safe driving, and who gets the keys.",
      definition: "A cloud security model dividing accountability between cloud provider (Microsoft) and customer, depending on whether you choose IaaS, PaaS, or SaaS.",
      exam_tip: "Physical datacenter security is always Microsoft's responsibility; data classification, identities, and access management are always the customer's.",
    },
    exam: {
      analogy: "A strict contractual demarcation of operational and cybersecurity controls across physical, infrastructure, platform, application, and data layers.",
      definition: "Cloud governance framework delineating security obligations. As you transition from On-Premises to IaaS, PaaS, and SaaS, Microsoft takes on more operational management.",
      exam_tip: "AZ-900 favorite question: The customer always retains 100% responsibility for Information and Data, Devices/Endpoints, and Identity & Access Management.",
    },
    check: {
      q: "Under the Shared Responsibility Model, which duty always remains the sole responsibility of the customer across IaaS, PaaS, and SaaS?",
      options: [
        "Operating system security patching",
        "Physical datacenter security",
        "Data governance and identity/access management"
      ],
      answer: 2,
      why: "Regardless of service model, the customer is always responsible for protecting their data and controlling user access."
    }
  },

  "microsoft entra id": {
    title: "Microsoft Entra ID",
    eli12: {
      analogy: "Like a universal student badge that unlocks your school locker, signs you into library computers, and proves you are allowed into the gym.",
      definition: "Microsoft's cloud service that checks your username and password, protecting who gets to sign into Azure and your company apps.",
      exam_tip: "Formerly named Azure Active Directory (Azure AD). It handles identity, Single Sign-On (SSO), and Multi-Factor Authentication (MFA).",
    },
    normal: {
      analogy: "Like a central digital passport office for all your company's cloud services, confirming your identity before letting you enter any room.",
      definition: "A comprehensive cloud-based identity and access management (IAM) solution providing authentication, authorization, conditional access, and role assignments.",
      exam_tip: "Entra ID is not the same as Windows Server Active Directory; it is cloud-native and uses internet protocols like SAML, OAuth 2.0, and OpenID Connect.",
    },
    exam: {
      analogy: "An enterprise-scale identity plane and directory service orchestrating tenant identity, B2B/B2C federation, and Zero Trust verification gates.",
      definition: "Cloud IAM service managing user identities, application access, MFA, Conditional Access policies, Privileged Identity Management (PIM), and RBAC.",
      exam_tip: "AZ-900 trap: Microsoft Entra ID provides Authentication (AuthN) and Authorization (AuthZ), but Authentication is verifying identity, while Authorization is checking rights.",
    },
    check: {
      q: "What was Microsoft Entra ID previously known as?",
      options: [
        "Azure Active Directory (Azure AD)",
        "Azure Security Center",
        "Active Directory Federation Services (ADFS)"
      ],
      answer: 0,
      why: "Microsoft rebranded Azure Active Directory to Microsoft Entra ID to unify its identity and network access family."
    }
  },

  "azure virtual machines": {
    title: "Azure Virtual Machines (VMs)",
    eli12: {
      analogy: "Like renting a remote computer over the internet that you can turn on, install any video game or software on, and pay for only while it's turned on.",
      definition: "A digital computer running in Microsoft's cloud that acts just like a physical PC or server with its own CPU, memory, storage, and operating system.",
      exam_tip: "Azure VMs represent Infrastructure as a Service (IaaS). You are responsible for configuring the OS, updates, and installed applications.",
    },
    normal: {
      analogy: "Like leasing dedicated computer hardware in a remote server room where you have full administrator access without buying physical boxes.",
      definition: "On-demand, scalable computing resources in Azure providing IaaS virtualization flexibility without needing to maintain physical server hardware.",
      exam_tip: "VM Scale Sets (VMSS) allow you to automatically scale identical VMs up or down based on incoming user traffic or schedules.",
    },
    exam: {
      analogy: "Hyper-V virtualized compute instances providing complete guest operating system control under an Infrastructure-as-a-Service consumption paradigm.",
      definition: "IaaS compute service providing burstable, compute-optimized, or memory-optimized compute instances with configurable disks and virtual network interfaces.",
      exam_tip: "AZ-900 focus: Deallocating a VM stops compute charges, but storage disk charges continue. You manage OS patches; Azure manages host hardware.",
    },
    check: {
      q: "What cloud computing model does an Azure Virtual Machine represent?",
      options: [
        "Infrastructure as a Service (IaaS)",
        "Platform as a Service (PaaS)",
        "Software as a Service (SaaS)"
      ],
      answer: 0,
      why: "VMs are the textbook example of IaaS: Azure provides the hardware and virtualization, while you manage OS configuration, security patches, and software."
    }
  },

  "azure app service": {
    title: "Azure App Service",
    eli12: {
      analogy: "Like renting a fully equipped kitchen where you only bring your ingredients and recipe, without having to build the oven or fix the plumbing.",
      definition: "An Azure service for hosting websites and mobile web backends where you upload your code and Azure takes care of the server behind the scenes.",
      exam_tip: "Azure App Service is Platform as a Service (PaaS). You manage the code and data; Azure manages the operating system, patching, and scaling.",
    },
    normal: {
      analogy: "Like a managed web hosting platform that automatically handles server updates, SSL certificates, and autoscaling so developers can focus solely on code.",
      definition: "An HTTP-based PaaS service for hosting web applications, REST APIs, and mobile backends supporting .NET, Java, Node.js, Python, and PHP.",
      exam_tip: "Features built-in deployment slots (Staging vs Production) for zero-downtime deployments and instant rollbacks.",
    },
    exam: {
      analogy: "An abstraction layer over web server fleets providing autoscaling, custom domain TLS, integrated CI/CD, and compliance guardrails.",
      definition: "PaaS compute offering for deploying containerized or code-based web apps with integrated security, load balancing, autoscaling, and diagnostic logging.",
      exam_tip: "AZ-900 exam differentiator: Choose App Service over VMs when the goal is to eliminate OS maintenance and focus on application development.",
    },
    check: {
      q: "Which cloud service model best categorizes Azure App Service?",
      options: [
        "IaaS",
        "PaaS",
        "SaaS"
      ],
      answer: 1,
      why: "App Service is a PaaS (Platform as a Service) offering where Microsoft manages the runtime, web server, and OS."
    }
  },

  "azure functions": {
    title: "Azure Functions (Serverless)",
    eli12: {
      analogy: "Like a vending machine that stays asleep using zero power until you drop a coin in, then runs for three seconds to give you a soda and goes right back to sleep.",
      definition: "A way to run small pieces of code on-demand when an event happens, without keeping any server running or paying when nothing is happening.",
      exam_tip: "Azure Functions is Serverless compute. You only pay for the exact milliseconds your code executes, scaling to zero when idle.",
    },
    normal: {
      analogy: "Like an automatic motion-sensor light that only turns on when someone walks into the room, saving power and cost when nobody is there.",
      definition: "An event-driven serverless compute platform that solves complex orchestration problems by executing code in response to triggers like HTTP requests or database updates.",
      exam_tip: "Key serverless traits: event-driven, micro-billing based on execution time, and automatic elastic scaling from zero to thousands of instances.",
    },
    exam: {
      analogy: "FaaS (Function-as-a-Service) execution container invoked statelessly via triggers and output bindings with sub-second provisioning.",
      definition: "Serverless compute service executing discrete event-driven code blocks triggered by webhooks, timers, queues, or Cosmos DB changes.",
      exam_tip: "AZ-900 key term: 'Serverless' does NOT mean there are no servers; it means the cloud provider abstracts all server management, and costs scale to zero.",
    },
    check: {
      q: "What is a primary financial benefit of using Serverless compute like Azure Functions?",
      options: [
        "You pay a fixed monthly fee regardless of usage",
        "You only pay for compute resources while code is actively running",
        "Microsoft guarantees 100% free compute for all web apps"
      ],
      answer: 1,
      why: "In serverless computing, billing is strictly consumption-based; you pay only for execution time and memory consumed, with zero idle cost."
    }
  },

  "virtual network": {
    title: "Azure Virtual Network (VNet)",
    eli12: {
      analogy: "Like a private gated neighborhood where your computers can talk directly to each other through secure private roads without strangers seeing them.",
      definition: "Your own isolated private network inside Azure that lets your virtual machines, databases, and services talk securely to each other and the internet.",
      exam_tip: "VNets provide isolation and segmentation. You divide a VNet into one or more subnets for security and organization.",
    },
    normal: {
      analogy: "Like the private Wi-Fi network in your office that connects all company laptops and printers securely behind a firewall.",
      definition: "The fundamental networking building block in Azure that enables resources to securely communicate with each other, the internet, and on-premises networks.",
      exam_tip: "VNet Peering allows you to connect two Azure virtual networks together with high bandwidth and low latency over Microsoft's backbone network.",
    },
    exam: {
      analogy: "Software-defined network (SDN) overlay isolating IP address spaces with route tables, subnets, and peering topologies.",
      definition: "Private isolated networking space defined by RFC 1918 private CIDR blocks, supporting subnets, Network Security Groups, Route Tables, and VNet Peering.",
      exam_tip: "AZ-900 point: VNet Peering connects VNets without routing traffic over the public internet. Peering traffic stays entirely on Microsoft's private global backbone.",
    },
    check: {
      q: "Which Azure networking feature enables two Virtual Networks to communicate directly across Microsoft's private network backbone?",
      options: [
        "VNet Peering",
        "Public IP Routing",
        "ExpressRoute Gateway"
      ],
      answer: 0,
      why: "VNet Peering connects virtual networks seamlessly with low latency, keeping all traffic on Microsoft's private global fiber network."
    }
  },

  "network security group": {
    title: "Network Security Group (NSG)",
    eli12: {
      analogy: "Like a security guard at a building door with a strict guest list, checking everyone's ID and badge number before letting them in or out.",
      definition: "A virtual firewall filter that allows or blocks network traffic into and out of your Azure virtual machines and subnets.",
      exam_tip: "NSGs filter traffic using 5-tuple rules: Source, Source Port, Destination, Destination Port, and Protocol. Lower rule numbers take higher priority.",
    },
    normal: {
      analogy: "Like an access control list on an office router that permits web browsing on port 80/443 while blocking suspicious incoming connections.",
      definition: "A security feature that filters network traffic to and from Azure resources in an Azure Virtual Network based on priority rules.",
      exam_tip: "Can be applied to a subnet level, network interface (NIC) level, or both. Default rules cannot be deleted but can be overridden by higher-priority rules.",
    },
    exam: {
      analogy: "Stateful Layer 4 packet filter evaluating prioritized inbound and outbound rule sets against IP tuples.",
      definition: "Layer 4 access control mechanism containing prioritized security rules evaluated in numerical order (100 to 4096) to permit or deny network flows.",
      exam_tip: "AZ-900 trap: Lower numbers have higher priority (e.g., rule 100 is processed before rule 200). When a rule matches, evaluation stops.",
    },
    check: {
      q: "How does an Azure Network Security Group (NSG) determine which rule takes precedence when multiple rules apply?",
      options: [
        "The rule with the lowest priority number is evaluated first",
        "The rule created most recently overrides older rules",
        "Deny rules always take precedence regardless of number"
      ],
      answer: 0,
      why: "NSG rules are processed in priority order from lowest number (highest priority) to highest number; once a match is found, no further rules are evaluated."
    }
  },

  "azure policy": {
    title: "Azure Policy",
    eli12: {
      analogy: "Like a school rule handbook that prevents students from running in hallways or bringing phones to class before any trouble starts.",
      definition: "A system in Azure that enforces company rules and standards on your cloud resources, like making sure nobody creates servers in the wrong country.",
      exam_tip: "Azure Policy evaluates resources for compliance and can prevent non-compliant resources from being created.",
    },
    normal: {
      analogy: "Like automatic guardrails on a bowling alley lane that prevent any ball from rolling into the gutter.",
      definition: "A governance tool that creates, assigns, and manages policy definitions to enforce rules on your resources for corporate standards and service-level compliance.",
      exam_tip: "Common policies include restricting allowed VM sizes, enforcing allowed deployment regions, and requiring specific tags on all resources.",
    },
    exam: {
      analogy: "A declarative governance engine enforcing corporate compliance, remediation, and resource constraints across management group hierarchies.",
      definition: "Azure governance service evaluating resource properties against business rules formatted in JSON, supporting audit, deny, and auto-remediation actions.",
      exam_tip: "AZ-900 comparison: Azure Policy enforces rules and compliance guardrails; Azure RBAC controls user permissions and actions. They work together.",
    },
    check: {
      q: "What is the primary purpose of Azure Policy?",
      options: [
        "To assign administrative permissions to employees",
        "To enforce corporate standards and assess organizational compliance across resources",
        "To encrypt databases at rest using custom keys"
      ],
      answer: 1,
      why: "Azure Policy enforces rules and guardrails (e.g. allowed regions or required tags) across Azure subscriptions."
    }
  },

  "resource locks": {
    title: "Azure Resource Locks",
    eli12: {
      analogy: "Like putting a childproof safety lock on a cabinet door so nobody can accidentally throw away important medicine or papers.",
      definition: "A protective setting in Azure that stops administrators or users from accidentally deleting or changing critical resources.",
      exam_tip: "There are two lock types: CanNotDelete (users can read and modify, but cannot delete) and ReadOnly (users can only read, no changes or deletions).",
    },
    normal: {
      analogy: "Like marking a document as 'Read-Only' or enabling write-protection on a backup drive to prevent accidental overwrite or disposal.",
      definition: "A management setting applied to a subscription, resource group, or resource that prevents accidental deletion or unauthorized modifications.",
      exam_tip: "Resource locks apply to all users, even those with full Subscription Owner privileges. A lock must be explicitly removed before deletion.",
    },
    exam: {
      analogy: "Immutable administrative constraint overriding RBAC permissions to guarantee business continuity for critical infrastructure.",
      definition: "Management locks enforcing CanNotDelete (Delete) or ReadOnly (ReadOnly) protection, inherited through the hierarchy from subscriptions down to resources.",
      exam_tip: "AZ-900 trap: RBAC roles do NOT bypass locks. Even an Owner cannot delete a locked resource until the lock is explicitly deleted.",
    },
    check: {
      q: "Which Azure Resource Lock level prevents users from deleting a resource while still allowing them to modify its settings?",
      options: [
        "ReadOnly",
        "CanNotDelete",
        "ModifyOnly"
      ],
      answer: 1,
      why: "CanNotDelete allows authorized users to read and modify a resource, but completely blocks anyone from deleting it."
    }
  },

  "azure advisor": {
    title: "Azure Advisor",
    eli12: {
      analogy: "Like a friendly expert teacher looking over your homework who points out where you can save money, do things faster, or make your work safer.",
      definition: "A free built-in tool in Azure that analyzes your cloud setup and gives you tips to save money, improve security, and prevent downtime.",
      exam_tip: "Advisor provides recommendations across 5 pillars: Cost, Security, Reliability (High Availability), Performance, and Operational Excellence.",
    },
    normal: {
      analogy: "Like a personal financial advisor and safety inspector for your cloud infrastructure, continuously finding wasted spending and vulnerabilities.",
      definition: "A personalized cloud consultant that analyzes your resource configuration and usage telemetry to recommend actionable best practices.",
      exam_tip: "Advisor is free to use and provides recommendations aligned with the Microsoft Azure Well-Architected Framework.",
    },
    exam: {
      analogy: "Telemetry-driven recommendation engine scoring cloud deployments against the Azure Well-Architected Framework pillars.",
      definition: "Autonomous recommendation engine inspecting resource configurations and telemetry to deliver prioritized optimization proposals.",
      exam_tip: "AZ-900 memorization: Know the 5 Advisor categories: Reliability, Security, Performance, Cost, and Operational Excellence.",
    },
    check: {
      q: "Which of the following is NOT one of the 5 recommendation categories provided by Azure Advisor?",
      options: [
        "Cost",
        "Source Code Syntax",
        "Reliability"
      ],
      answer: 1,
      why: "Advisor focuses on infrastructure optimization (Cost, Security, Reliability, Performance, Operational Excellence), not analyzing source code syntax."
    }
  },

  "azure openai": {
    title: "Azure OpenAI Service",
    eli12: {
      analogy: "Like having a super-smart robot assistant like ChatGPT, but locked inside your company's private vault so none of your secrets leak outside.",
      definition: "A Microsoft service that lets you use advanced artificial intelligence (like GPT-4) inside your apps with enterprise-level security and privacy.",
      exam_tip: "Azure OpenAI combines OpenAI's frontier AI models with Microsoft's enterprise security, compliance, data privacy, and RBAC.",
    },
    normal: {
      analogy: "Like giving your software a direct line to cutting-edge AI reasoning while ensuring company data is never used to train public models.",
      definition: "A cloud service providing REST API access to OpenAI's language, vision, and code generation models with enterprise SLA, network isolation, and content filtering.",
      exam_tip: "Customer prompts and completions are never used to train or improve any OpenAI or Microsoft models.",
    },
    exam: {
      analogy: "Enterprise-grade generative AI orchestration boundary providing fine-tuning, quota management, and responsible AI guardrails.",
      definition: "Cognitive Service offering enterprise access to OpenAI foundational models backed by Microsoft's enterprise commitments, VNet private endpoints, and RBAC.",
      exam_tip: "AI-900 / AZ-900 key point: Azure OpenAI includes built-in Content Safety filters to detect and prevent hateful, sexual, violent, or self-harm content.",
    },
    check: {
      q: "Does Microsoft use customer data and prompts sent to Azure OpenAI to train public foundation models?",
      options: [
        "Yes, all prompts are used for continuous model improvement",
        "No, customer data is never used to retrain or fine-tune public models",
        "Only when using free tier subscriptions"
      ],
      answer: 1,
      why: "Microsoft's enterprise data commitment ensures that customer inputs and outputs in Azure OpenAI are not used to train or improve foundation models."
    }
  }
};

const COMPARISONS = {
  "region vs availability zone": {
    title: "Region vs Availability Zone",
    rows: [
      {
        aspect: "Definition",
        a: "A geographical area containing one or more datacenters within a defined latency perimeter.",
        b: "Physically separated datacenters within an enabled region with independent power and cooling."
      },
      {
        aspect: "Failure Isolation",
        a: "Protects against large-scale natural disasters (hurricanes, earthquakes) via paired regions.",
        b: "Protects against localized datacenter failures (power grid failure, cooling malfunction)."
      },
      {
        aspect: "Typical Scale",
        a: "60+ regions globally spanning continents and countries.",
        b: "At least 3 separate zones within each supported Azure region."
      },
      {
        aspect: "Exam SLA Target",
        a: "Disaster recovery strategy and data residency compliance boundaries.",
        b: "99.99% VM uptime SLA when deployed redundantly across zones."
      }
    ],
    remember: "Zones protect against a building fire; Regions protect against a statewide flood."
  },

  "blob storage vs file storage": {
    title: "Blob Storage vs File Storage",
    rows: [
      {
        aspect: "Primary Target",
        a: "Unstructured object data (images, videos, backups, streaming logs).",
        b: "Managed file shares accessed over network protocols."
      },
      {
        aspect: "Access Protocol",
        a: "REST API, HTTP/HTTPS web endpoints, AzCopy tool, and SDKs.",
        b: "Standard SMB (Server Message Block) and NFS (Network File System)."
      },
      {
        aspect: "Drive Mounting",
        a: "Cannot be mounted directly as a traditional network drive letter.",
        b: "Can be mounted as a drive letter (e.g. Z:) on Windows, Linux, and macOS."
      },
      {
        aspect: "Best Use Case",
        a: "Cloud-native web applications, mobile media streaming, big data lakes.",
        b: "Migrating legacy on-premises file servers ('lift-and-shift') and shared tools."
      }
    ],
    remember: "Blob is for web files and apps; File is for shared network drives."
  },

  "authentication vs authorization": {
    title: "Authentication (AuthN) vs Authorization (AuthZ)",
    rows: [
      {
        aspect: "Core Question",
        a: "'Who are you?' (Verifies and confirms your identity).",
        b: "'What are you allowed to do?' (Grants or denies access permissions)."
      },
      {
        aspect: "Typical Credentials",
        a: "Passwords, PINs, biometrics, security keys, and Multi-Factor Authentication (MFA).",
        b: "Azure Role-Based Access Control (RBAC), access tokens, permission policies."
      },
      {
        aspect: "Sequence",
        a: "Must occur FIRST before any access rights can be checked.",
        b: "Occurs SECOND, evaluating rights only after identity is established."
      },
      {
        aspect: "Azure Example",
        a: "Entering your username, password, and Microsoft Authenticator prompt.",
        b: "Assigning the 'Contributor' role on a resource group to allow VM creation."
      }
    ],
    remember: "AuthN proves who you are; AuthZ decides what doors you can open."
  },

  "iaas vs paas": {
    title: "IaaS vs PaaS",
    rows: [
      {
        aspect: "What You Manage",
        a: "Operating system, patching, middleware, runtime, apps, and data.",
        b: "Applications and data only; Microsoft manages the OS, runtime, and server."
      },
      {
        aspect: "Level of Control",
        a: "Highest control: full administrator access to the underlying virtual machine.",
        b: "Medium control: focus on writing application code and configuring settings."
      },
      {
        aspect: "Maintenance Effort",
        a: "High: customer is responsible for OS updates, antivirus, and security patches.",
        b: "Low: Microsoft automatically patches and maintains the underlying platform."
      },
      {
        aspect: "Azure Examples",
        a: "Azure Virtual Machines, Virtual Networks, Azure Disk Storage.",
        b: "Azure App Service, Azure SQL Database, Azure Functions."
      }
    ],
    remember: "IaaS is renting the computer; PaaS is renting the stage to run your play."
  },

  "vpn gateway vs expressroute": {
    title: "VPN Gateway vs ExpressRoute",
    rows: [
      {
        aspect: "Connection Route",
        a: "Encrypted tunnel routed over the public internet.",
        b: "Direct private optical connection bypassing the public internet entirely."
      },
      {
        aspect: "Bandwidth & Latency",
        a: "Lower throughput (up to 10 Gbps) with variable public internet latency.",
        b: "Ultra-high bandwidth (up to 100 Gbps) with predictable, single-digit latency."
      },
      {
        aspect: "Setup Cost & Time",
        a: "Low setup cost and fast provisioning via software configuration.",
        b: "Higher investment requiring connectivity partnerships and telco providers."
      },
      {
        aspect: "Best Use Case",
        a: "Branch offices, dev/test labs, and small-to-midsize secure connections.",
        b: "Mission-critical enterprise hybrid cloud, big data transfer, financial systems."
      }
    ],
    remember: "VPN travels on public roads with an armored car; ExpressRoute is a private railway."
  }
};

// Helper to normalize search keys
function clean(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Find closest matching explain topic
function findTopic(query) {
  const q = clean(query);
  if (!q) return null;

  // Direct match
  if (TOPICS[q]) return TOPICS[q];

  // Key word contains
  for (const key of Object.keys(TOPICS)) {
    if (q.includes(key) || key.includes(q)) {
      return TOPICS[key];
    }
  }

  // Common aliases
  const aliases = {
    "rg": "resource group",
    "resource groups": "resource group",
    "az": "availability zones",
    "zone": "availability zones",
    "zones": "availability zones",
    "blob": "azure blob storage",
    "blobs": "azure blob storage",
    "storage": "azure blob storage",
    "shared responsibility": "shared responsibility model",
    "entra": "microsoft entra id",
    "entra id": "microsoft entra id",
    "azure ad": "microsoft entra id",
    "active directory": "microsoft entra id",
    "vm": "azure virtual machines",
    "vms": "azure virtual machines",
    "virtual machine": "azure virtual machines",
    "app service": "azure app service",
    "web app": "azure app service",
    "functions": "azure functions",
    "function": "azure functions",
    "serverless": "azure functions",
    "vnet": "virtual network",
    "networking": "virtual network",
    "nsg": "network security group",
    "firewall": "network security group",
    "policy": "azure policy",
    "locks": "resource locks",
    "lock": "resource locks",
    "advisor": "azure advisor",
    "openai": "azure openai",
    "gpt": "azure openai",
    "ai": "azure openai"
  };

  for (const [alias, target] of Object.entries(aliases)) {
    if (q === alias || q.includes(alias)) {
      return TOPICS[target];
    }
  }

  return null;
}

// Find closest matching comparison
function findComparison(a, b) {
  const termA = clean(a);
  const termB = clean(b);
  const combined = `${termA} vs ${termB}`;
  const reverse = `${termB} vs ${termA}`;

  for (const [key, val] of Object.entries(COMPARISONS)) {
    if (key === combined || key === reverse) return val;
    const parts = key.split(" vs ");
    if (
      (clean(parts[0]).includes(termA) && clean(parts[1]).includes(termB)) ||
      (clean(parts[0]).includes(termB) && clean(parts[1]).includes(termA))
    ) {
      return val;
    }
  }

  return null;
}

// Synthesize answer dynamically for topics not in dictionary
function synthesizeTopic(topicName, level) {
  const raw = String(topicName || "").trim();
  const cap = raw.charAt(0).toUpperCase() + raw.slice(1);
  const isCloudy = /(azure|cloud|service|storage|compute|network|security|data|identity|iaas|paas|saas|api)/i.test(raw);

  if (level === "eli12") {
    return {
      title: cap,
      analogy: `Think of ${cap} like an everyday helpful tool: it handles the heavy lifting in the background so you can focus on building what you want.`,
      definition: `${cap} is a Microsoft Azure cloud capability designed to organize, run, or protect applications smoothly without physical hardware.`,
      exam_tip: `For exams, remember why someone would choose ${cap} over other options: look for key requirements like scalability, cost, or security.`,
      check: {
        q: `What is the primary benefit of utilizing ${cap} in a cloud environment?`,
        options: [
          `Greater scalability and reduced physical maintenance`,
          `Guaranteed zero electricity usage anywhere in the world`,
          `Eliminating the need for software code entirely`
        ],
        answer: 0,
        why: `Cloud services like ${cap} provide on-demand scalability, reliability, and eliminate physical hardware maintenance.`
      },
      confidence: isCloudy ? "high" : "low"
    };
  }

  if (level === "exam") {
    return {
      title: cap,
      analogy: `Represents a specialized architectural component within the Microsoft Azure Well-Architected Framework delivering targeted operational outcomes.`,
      definition: `${cap} is a managed Azure resource enabling enterprise workloads to achieve high availability, granular access governance, and predictable SLAs.`,
      exam_tip: `AZ-900 / AI-900 exam focus: Identify the specific service tier, security boundary, and cost allocation model associated with ${cap}.`,
      check: {
        q: `When designing an architecture around ${cap}, which consideration is most critical for the fundamentals exam?`,
        options: [
          `Understanding its role in high availability and the shared responsibility boundary`,
          `Memorizing the physical serial numbers of the host servers`,
          `Requiring on-premises hardware installation before deployment`
        ],
        answer: 0,
        why: `Exam questions consistently evaluate your grasp of service boundaries, resiliency, and operational responsibility.`
      },
      confidence: isCloudy ? "high" : "low"
    };
  }

  // Normal level
  return {
    title: cap,
    analogy: `Like a specialized utility service in a modern office building: it is ready whenever you need it and scales up when more people use it.`,
    definition: `${cap} is an Azure cloud technology providing reliable, scalable infrastructure or platform capabilities for modern digital workloads.`,
    exam_tip: `Remember to verify the exact features and pricing model of ${cap} on Microsoft Learn before taking your fundamentals exam.`,
    check: {
      q: `Why do organizations migrate workloads to services like ${cap} in Microsoft Azure?`,
      options: [
        `To gain elasticity, high availability, and global cloud reach`,
        `Because physical servers are completely illegal in modern business`,
        `To eliminate the need for internet access`
      ],
      answer: 0,
      why: `The cloud provides agility, high availability, and flexible scalability compared to traditional on-premises setups.`
    },
    confidence: isCloudy ? "high" : "low"
  };
}

// Synthesize comparison dynamically
function synthesizeComparison(termA, termB, level) {
  const a = String(termA || "").trim();
  const b = String(termB || "").trim();
  const capA = a.charAt(0).toUpperCase() + a.slice(1);
  const capB = b.charAt(0).toUpperCase() + b.slice(1);

  return {
    title: `${capA} vs ${capB}`,
    rows: [
      {
        aspect: "Primary Purpose",
        a: `Focused on core capabilities and workflows dedicated to ${capA}.`,
        b: `Focused on specialized functions and distinct requirements of ${capB}.`
      },
      {
        aspect: "Control & Management",
        a: `Provides specific controls tailored to ${capA} operational requirements.`,
        b: `Offers distinct governance and configuration levers for ${capB}.`
      },
      {
        aspect: "Common Exam Trap",
        a: `Often mistaken for ${capB} when speed or simplicity is the main question driver.`,
        b: `Often confused with ${capA} when comprehensive control or scale is required.`
      },
      {
        aspect: "Recommendation",
        a: `Choose ${capA} when its unique architectural model directly matches the scenario.`,
        b: `Choose ${capB} when specialized workload requirements demand its capabilities.`
      }
    ],
    remember: `Remember: ${capA} focuses on its core use case; ${capB} provides a distinct solution.`,
    confidence: "high"
  };
}

// Master query resolver
function resolveStudyQuery(mode, level, q, a, b) {
  const chosenLevel = ["eli12", "normal", "exam"].includes(level) ? level : "normal";

  if (mode === "compare") {
    const termA = String(a || "").trim();
    const termB = String(b || "").trim();
    if (!termA || !termB) {
      throw new Error("Both terms are required for comparison.");
    }

    const cached = findComparison(termA, termB);
    if (cached) {
      return {
        title: cached.title,
        headers: [termA, termB],
        rows: cached.rows,
        remember: cached.remember,
        confidence: "high"
      };
    }

    return synthesizeComparison(termA, termB, chosenLevel);
  }

  // Explain mode
  const topic = String(q || "").trim();
  if (!topic) {
    throw new Error("A topic is required.");
  }

  const found = findTopic(topic);
  if (found) {
    const lvlData = found[chosenLevel] || found.normal;
    return {
      title: found.title,
      analogy: lvlData.analogy,
      definition: lvlData.definition,
      exam_tip: lvlData.exam_tip,
      check: found.check,
      confidence: "high"
    };
  }

  return synthesizeTopic(topic, chosenLevel);
}

// Support CommonJS export and browser global
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TOPICS,
    COMPARISONS,
    resolveStudyQuery,
    findTopic,
    findComparison
  };
} else if (typeof window !== "undefined") {
  window.AzureStudyEngine = {
    TOPICS,
    COMPARISONS,
    resolveStudyQuery,
    findTopic,
    findComparison
  };
}
