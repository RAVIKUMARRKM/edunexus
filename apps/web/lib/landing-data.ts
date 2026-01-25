import {
  GraduationCap,
  Users,
  Calendar,
  FileText,
  BookOpen,
  CreditCard,
  Briefcase,
  Package,
  Bus,
  Building2,
  Library,
  MessageSquare,
  BarChart3,
  Settings,
  UserCheck,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Layers,
  Smartphone,
  Lock,
  HeadphonesIcon,
  CheckCircle2,
  Upload,
  Download,
  Cloud,
  Globe,
  Mail,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Feature {
  name: string;
  icon: LucideIcon;
  description: string;
  details: string[];
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  features: Feature[];
}

export interface Benefit {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  timeIndicator: string;
}

export interface Stat {
  value: number;
  label: string;
  suffix: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  school: string;
  rating: number;
  avatar?: string;
}

export interface Integration {
  name: string;
  category: string;
  logo?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const featureCategories: FeatureCategory[] = [
  {
    id: 'student-lifecycle',
    name: 'Student Lifecycle',
    icon: GraduationCap,
    features: [
      {
        name: 'Student Management',
        icon: Users,
        description: 'Complete student lifecycle management from admission to graduation with digital profiles and bulk operations.',
        details: [
          'Digital student profiles with photo and documents',
          'Bulk import and export capabilities',
          'Advanced filtering by class, section, and status',
          'Document management and storage',
          'Status tracking (Active, Inactive, Left, Graduated, Suspended)',
        ],
      },
      {
        name: 'Attendance Tracking',
        icon: Calendar,
        description: 'Real-time attendance management with multiple status options, SMS alerts, and comprehensive reporting.',
        details: [
          'Multiple status: Present, Absent, Late, Half-Day, Leave',
          'Quick bulk marking and edit previous records',
          'SMS alerts for absences',
          'Comprehensive reports and trend analysis',
          'Class-wise and student-wise reports',
          'Defaulter identification',
        ],
      },
      {
        name: 'Examination System',
        icon: FileText,
        description: 'Complete examination management with grade entry, result calculation, and automated report card generation.',
        details: [
          'Create exams with customizable parameters',
          'Grade entry and management interface',
          'Automatic result calculation',
          'Report card generation and publishing',
          'Support for multiple exam types',
          'Performance analytics',
        ],
      },
      {
        name: 'Academic Planning',
        icon: BookOpen,
        description: 'Organize classes, sections, subjects, and timetables with flexible academic year management.',
        details: [
          'Class and section management',
          'Subject assignment per class',
          'Timetable creation and management',
          'Academic year configuration',
          'Term management',
        ],
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Operations',
    icon: CreditCard,
    features: [
      {
        name: 'Fee Management',
        icon: CreditCard,
        description: 'Streamline fee collection with receipt generation, payment tracking, and defaulter management.',
        details: [
          'Flexible fee structure management',
          'Student-wise fee collection',
          'Receipt generation and printing',
          'Multiple payment modes support',
          'Concession management',
          'Fee reports and analytics',
          'Defaulter identification',
        ],
      },
      {
        name: 'HR & Payroll',
        icon: Briefcase,
        description: 'Manage staff, leave requests, and monthly salary processing with automated calculations.',
        details: [
          'Staff directory and employment details',
          'Leave request submission and approval workflow',
          'Leave balance tracking',
          'Monthly salary processing',
          'Payment history',
          'Department management',
        ],
      },
      {
        name: 'Inventory Management',
        icon: Package,
        description: 'Track inventory items, manage purchase orders, and monitor stock levels with low stock alerts.',
        details: [
          'Item categorization and tracking',
          'Stock quantity monitoring',
          'Low stock alerts',
          'Purchase order management',
          'Vendor management',
          'Inventory valuation',
        ],
      },
    ],
  },
  {
    id: 'facility',
    name: 'Facility Management',
    icon: Building2,
    features: [
      {
        name: 'Transport Management',
        icon: Bus,
        description: 'Manage vehicles, routes, stops, and student allocations for efficient school transport operations.',
        details: [
          'Vehicle management and tracking',
          'Route planning with multiple stops',
          'Student route allocation',
          'Vehicle status monitoring',
          'Route optimization',
        ],
      },
      {
        name: 'Hostel Management',
        icon: Building2,
        description: 'Organize hostel buildings, rooms, and student allocations with occupancy tracking.',
        details: [
          'Building and room management',
          'Room capacity tracking',
          'Student room allocation',
          'Occupancy rate monitoring',
          'Room availability tracking',
        ],
      },
      {
        name: 'Library Management',
        icon: Library,
        description: 'Comprehensive library system with book catalog, issue/return tracking, and fine management.',
        details: [
          'Book catalog with ISBN tracking',
          'Category classification',
          'Issue and return functionality',
          'Fine management and collection',
          'Overdue book tracking',
          'Library reports and analytics',
        ],
      },
    ],
  },
  {
    id: 'communication',
    name: 'Communication & Analytics',
    icon: MessageSquare,
    features: [
      {
        name: 'Communication Hub',
        icon: MessageSquare,
        description: 'Notice board and messaging system for seamless communication between staff, parents, and students.',
        details: [
          'Notice board with targeted audiences',
          'Private messaging system',
          'Bulk announcements',
          'Email notifications (coming soon)',
          'SMS alerts integration',
        ],
      },
      {
        name: 'Dashboard & Analytics',
        icon: BarChart3,
        description: 'Real-time insights with comprehensive dashboards, charts, and actionable analytics.',
        details: [
          'Real-time statistics cards',
          'Attendance trend charts',
          'Fee collection analytics',
          'Class distribution visualization',
          'Recent activities feed',
          'Pending tasks widget',
        ],
      },
      {
        name: 'Settings & Configuration',
        icon: Settings,
        description: 'Configure school information, academic years, and system settings from a centralized hub.',
        details: [
          'School information and branding',
          'Academic year management',
          'Term configuration',
          'User role management (coming soon)',
          'System preferences',
        ],
      },
    ],
  },
  {
    id: 'staff',
    name: 'Staff Management',
    icon: UserCheck,
    features: [
      {
        name: 'Teacher Management',
        icon: UserCheck,
        description: 'Comprehensive teacher profiles with department and subject assignments, attendance tracking.',
        details: [
          'Teacher profiles with documents',
          'Grid and table view options',
          'Department assignment',
          'Subject assignment',
          'Teacher attendance tracking',
          'Status management',
        ],
      },
      {
        name: 'HR Operations',
        icon: Briefcase,
        description: 'Streamlined HR processes including leave management and department organization.',
        details: [
          'Leave request workflow',
          'Department management',
          'Staff directory',
          'Employment tracking',
          'Role assignment',
        ],
      },
    ],
  },
];

export const benefits: Benefit[] = [
  {
    id: 'all-in-one',
    icon: Layers,
    title: 'All-in-One Platform',
    description: 'Replace 15+ separate tools with one unified system. No more juggling between different apps for students, fees, attendance, and communication.',
    features: [
      'Single dashboard for complete overview',
      'Unified data across all modules',
      'No complex integrations needed',
      'Reduced training time',
    ],
  },
  {
    id: 'real-time',
    icon: TrendingUp,
    title: 'Real-Time Insights',
    description: 'Make data-driven decisions with live dashboards and actionable analytics. Track everything from attendance trends to fee collection in real-time.',
    features: [
      'Live attendance and fee dashboards',
      'Trend analysis and forecasting',
      'Performance metrics',
      'Instant notifications',
    ],
  },
  {
    id: 'mobile-first',
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Manage your school from anywhere with our responsive mobile interface. Access all features on the go from any device.',
    features: [
      'Fully responsive design',
      'Native mobile experience',
      'Offline capability (coming soon)',
      'Push notifications',
    ],
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance standards protect your sensitive student and financial data at all times.',
    features: [
      'End-to-end encryption',
      'Role-based access control',
      'Audit logs and tracking',
      'Regular security updates',
    ],
  },
  {
    id: 'seamless',
    icon: Zap,
    title: 'Seamless Integration',
    description: 'All modules work together perfectly. Student data flows automatically to attendance, fees, exams, and all other modules.',
    features: [
      'Automatic data synchronization',
      'No manual data entry',
      'Cross-module reports',
      'Unified search',
    ],
  },
  {
    id: 'support',
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated support team always available to help. Get quick responses and expert guidance whenever you need it.',
    features: [
      'Live chat support',
      'Email support',
      'Video tutorials',
      'Comprehensive documentation',
    ],
  },
];

export const howItWorksSteps: Step[] = [
  {
    number: 1,
    icon: Settings,
    title: 'Setup',
    description: 'Configure your school settings and academic year in minutes',
    details: [
      'Add school information',
      'Set up academic year and terms',
      'Configure classes and sections',
    ],
    timeIndicator: '10 minutes',
  },
  {
    number: 2,
    icon: Upload,
    title: 'Import',
    description: 'Bulk import students, teachers, and existing data seamlessly',
    details: [
      'Upload CSV files',
      'Map data fields',
      'Validate and import',
    ],
    timeIndicator: 'Seamless',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Manage',
    description: 'Track attendance, fees, and activities effortlessly every day',
    details: [
      'Mark attendance',
      'Collect fees',
      'Generate reports',
    ],
    timeIndicator: 'Daily',
  },
  {
    number: 4,
    icon: BarChart3,
    title: 'Analyze',
    description: 'Get actionable reports and analytics for better decisions',
    details: [
      'View dashboards',
      'Analyze trends',
      'Export reports',
    ],
    timeIndicator: 'Real-time',
  },
];

export const stats: Stat[] = [
  {
    value: 10000,
    label: 'Schools',
    suffix: '+',
    icon: Building2,
  },
  {
    value: 1000000,
    label: 'Students',
    suffix: '+',
    icon: Users,
  },
  {
    value: 50000,
    label: 'Teachers',
    suffix: '+',
    icon: UserCheck,
  },
  {
    value: 99.9,
    label: 'Uptime',
    suffix: '%',
    icon: Clock,
  },
  {
    value: 15,
    label: 'Modules',
    suffix: '+',
    icon: Layers,
  },
  {
    value: 24,
    label: 'Support',
    suffix: '/7',
    icon: HeadphonesIcon,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'EduNexus transformed our school operations completely. We went from using 10+ different tools to just one platform. The time saved is incredible!',
    author: 'Dr. Sarah Johnson',
    role: 'Principal',
    school: 'Greenwood High School',
    rating: 5,
  },
  {
    id: '2',
    quote: 'The fee management and receipt generation features alone have saved us countless hours. Parents love the transparency and ease of payment.',
    author: 'Rajesh Kumar',
    role: 'Finance Manager',
    school: 'Delhi Public School',
    rating: 5,
  },
  {
    id: '3',
    quote: 'As a teacher, I appreciate how easy it is to mark attendance and enter grades. The interface is intuitive and the mobile app is excellent.',
    author: 'Emily Chen',
    role: 'Senior Teacher',
    school: 'International Academy',
    rating: 5,
  },
];

export const integrations: Integration[] = [
  { name: 'Stripe', category: 'Payment' },
  { name: 'PayPal', category: 'Payment' },
  { name: 'Razorpay', category: 'Payment' },
  { name: 'Twilio', category: 'SMS' },
  { name: 'MSG91', category: 'SMS' },
  { name: 'SendGrid', category: 'Email' },
  { name: 'Mailgun', category: 'Email' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Google Drive', category: 'Storage' },
  { name: 'Dropbox', category: 'Storage' },
];

export const securityFeatures = [
  {
    icon: Shield,
    title: 'SSL Encrypted',
    description: 'All data encrypted in transit',
  },
  {
    icon: Lock,
    title: 'GDPR Compliant',
    description: 'Full compliance with data protection',
  },
  {
    icon: CheckCircle2,
    title: 'ISO 27001',
    description: 'Information security certified',
  },
  {
    icon: Cloud,
    title: 'Daily Backups',
    description: 'Automated daily data backups',
  },
];

export const privacyFeatures = [
  'Role-based access control',
  'Complete audit logs',
  'Data encryption at rest',
  'Regular security updates',
  'Two-factor authentication (coming soon)',
  'Single sign-on support (coming soon)',
];

export const faqs: FAQItem[] = [
  {
    question: 'How long does setup take?',
    answer: 'Initial setup takes about 10-15 minutes. You can configure your school information, academic year, and basic settings in one sitting. Importing existing data is seamless with our bulk import feature.',
  },
  {
    question: 'Can I import existing student data?',
    answer: 'Yes! You can bulk import students, teachers, and other data using CSV files. Our system provides a simple mapping interface to match your existing data fields with our platform.',
  },
  {
    question: 'Is training provided?',
    answer: 'Absolutely! We provide comprehensive video tutorials, documentation, and live onboarding sessions. Our support team is available 24/7 to help with any questions.',
  },
  {
    question: 'What\'s included in the free trial?',
    answer: 'The free trial includes access to all 15+ modules with no feature restrictions. You can test student management, fee collection, attendance, exams, and all other features for 14 days.',
  },
  {
    question: 'How is pricing calculated?',
    answer: 'Pricing is based on the number of students in your school. We offer flexible plans for small schools, medium institutions, and large educational organizations. Contact us for a custom quote.',
  },
  {
    question: 'Is mobile access available?',
    answer: 'Yes! EduNexus is fully responsive and works perfectly on mobile devices. Teachers can mark attendance, parents can check fees, and admins can manage everything from their phones.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer 24/7 email and chat support for all customers. Premium plans include phone support and dedicated account managers. We also have extensive documentation and video tutorials.',
  },
  {
    question: 'Can I customize modules?',
    answer: 'Yes! You can enable/disable modules based on your needs. We also offer custom development for specific requirements. Contact our sales team to discuss customization options.',
  },
];

export const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Demo', href: '/demo' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'API Documentation', href: '/docs/api' },
  ],
  solutions: [
    { name: 'For K-12 Schools', href: '/solutions/k12' },
    { name: 'For Universities', href: '/solutions/universities' },
    { name: 'For Coaching Centers', href: '/solutions/coaching' },
    { name: 'For International Schools', href: '/solutions/international' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Case Studies', href: '/case-studies' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help' },
    { name: 'Video Tutorials', href: '/tutorials' },
    { name: 'Community Forum', href: '/community' },
    { name: 'System Status', href: '/status' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Security', href: '/security' },
  ],
};

export const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/edunexus', icon: Globe },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/edunexus', icon: Globe },
  { name: 'Facebook', href: 'https://facebook.com/edunexus', icon: Globe },
  { name: 'YouTube', href: 'https://youtube.com/edunexus', icon: Globe },
];
