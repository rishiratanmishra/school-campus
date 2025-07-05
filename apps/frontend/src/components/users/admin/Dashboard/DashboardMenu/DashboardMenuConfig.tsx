    import {
    PlusCircle,
    UserPlus,
    UserPlus2,
    UserCog,
    ClipboardList,
    FilePlus2,
    CalendarClock,
    TrendingUp,
    GraduationCap,
    CalendarDays,
    UserRound,
    UserRoundCog,
    UsersRound,
    MessageCircle,
    Send,
    Megaphone,
    PhoneCall,
    CheckSquare,
    Check,
    AlertCircle,
    BarChart,
    Wallet,
    FileText,
    CreditCard,
    BadgeAlert,
    BookOpenCheck,
    UploadCloud,
    ListTodo,
    ClipboardCheck,
    FileStack,
    CalendarPlus,
    FileEdit,
    Star,
    Bus,
    MapPin,
    Navigation,
    UserCheck,
    FileBadge,
    FileSignature,
    FileX2,
    IdCard,
    Activity,
    Eye,
    Monitor,
    LocateFixed,
    Settings,
    ShieldCheck,
    Landmark,
    ScrollText,
    BookMarked,
    TimerReset,
    Handshake,
    Layers,
    Trash2,
    Ban,
    } from 'lucide-react';

    export type DashboardMenuItem = {
    label: string;
    icon: React.ReactNode;
    action: string;
    };

    export type DashboardMenuGroup = {
    category: string;
    icon: React.ReactNode;
    items: DashboardMenuItem[];
    };

    export const dashboardMenuConfig: DashboardMenuGroup[] = [
    {
        category: 'Admissions & Enrollment',
        shortcut: 'A',
        icon: <GraduationCap />,
        itemShortcuts: ['1', '2', '3', '4', '5', '6'],
        items: [
        { label: 'New Student', icon: <UserPlus />, action: 'addStudent' },
        { label: 'New Teacher', icon: <UserPlus2 />, action: 'addTeacher' },
        { label: 'New Staff', icon: <UserCog />, action: 'addEmployee' },
        { label: 'Inquiry Form', icon: <ClipboardList />, action: 'newInquiry' },
        {
            label: 'Schedule Interview',
            icon: <CalendarClock />,
            action: 'scheduleInterview',
        },
        {
            label: 'Admission Confirmation',
            icon: <TrendingUp />,
            action: 'confirmAdmission',
        },
        ],
    },
    {
        category: 'Academics',
        shortcut: 'B',
        icon: <BookMarked />,
        itemShortcuts: ['1', '2', '3', '4', '5'],
        items: [
        {
            label: 'Create Timetable',
            icon: <CalendarDays />,
            action: 'createTimetable',
        },
        {
            label: 'Assign Subjects',
            icon: <ScrollText />,
            action: 'assignSubjects',
        },
        { label: 'Manage Syllabus', icon: <Layers />, action: 'manageSyllabus' },
        {
            label: 'Academic Calendar',
            icon: <CalendarPlus />,
            action: 'academicCalendar',
        },
        {
            label: 'Class Promotions',
            icon: <TrendingUp />,
            action: 'classPromotion',
        },
        ],
    },
    {
        category: 'Meetings & Interaction',
        shortcut: 'C',
        icon: <Handshake />,
        itemShortcuts: ['1', '2', '3'],
        items: [
        {
            label: 'Student Meeting',
            icon: <UserRound />,
            action: 'studentMeeting',
        },
        { label: 'Parent-Teacher Meet', icon: <UserRoundCog />, action: 'ptm' },
        { label: 'Staff Meeting', icon: <UsersRound />, action: 'staffMeeting' },
        ],
    },
    {
        category: 'Communication',
        shortcut: 'D',
        icon: <MessageCircle />,
        itemShortcuts: ['1', '2', '3'],
        items: [
        { label: 'Send Message', icon: <Send />, action: 'sendMessage' },
        { label: 'Notice Board', icon: <Megaphone />, action: 'broadcastNotice' },
        {
            label: 'Call Notification',
            icon: <PhoneCall />,
            action: 'sendCallAlert',
        },
        ],
    },
    {
        category: 'Attendance',
        shortcut: 'E',
        icon: <CheckSquare />,
        itemShortcuts: ['1', '2', '3'],
        items: [
        { label: 'Mark Attendance', icon: <Check />, action: 'markAttendance' },
        {
            label: 'View Absentees',
            icon: <AlertCircle />,
            action: 'viewAbsentees',
        },
        {
            label: 'Daily Report',
            icon: <BarChart />,
            action: 'dailyAttendanceReport',
        },
        ],
    },
    {
        category: 'Fees & Finance',
        shortcut: 'F',
        icon: <Wallet />,
        itemShortcuts: ['1', '2', '3', '4', '5'],
        items: [
        {
            label: 'Add Fee Structure',
            icon: <FileText />,
            action: 'addFeeStructure',
        },
        { label: 'Collect Fees', icon: <CreditCard />, action: 'collectPayment' },
        { label: 'Pending Dues', icon: <BadgeAlert />, action: 'pendingDues' },
        { label: 'Fee Receipt', icon: <FileText />, action: 'generateReceipt' },
        {
            label: 'Refund / Cancellation',
            icon: <Ban />,
            action: 'processRefund',
        },
        ],
    },
    {
        category: 'LMS (eLearning)',
        shortcut: 'G',
        icon: <BookOpenCheck />,
        itemShortcuts: ['1', '2', '3', '4'],
        items: [
        {
            label: 'Upload Material',
            icon: <UploadCloud />,
            action: 'uploadMaterial',
        },
        { label: 'Create Quiz', icon: <ListTodo />, action: 'createQuiz' },
        {
            label: 'Grade Assignment',
            icon: <ClipboardCheck />,
            action: 'gradeAssignment',
        },
        {
            label: 'Assignment Tracker',
            icon: <ListTodo />,
            action: 'trackAssignments',
        },
        ],
    },
    {
        category: 'Exams & Results',
        shortcut: 'H',
        icon: <FileStack />,
        itemShortcuts: ['1', '2', '3', '4'],
        items: [
        {
            label: 'Schedule Exam',
            icon: <CalendarPlus />,
            action: 'scheduleExam',
        },
        { label: 'Upload Marks', icon: <FileEdit />, action: 'uploadMarks' },
        { label: 'Publish Results', icon: <Star />, action: 'publishResults' },
        {
            label: 'Generate Report Cards',
            icon: <FileText />,
            action: 'generateReportCards',
        },
        ],
    },
    {
        category: 'Certificates & Documents',
        shortcut: 'I',
        icon: <FileBadge />,
        itemShortcuts: ['1', '2', '3', '4'],
        items: [
        {
            label: 'Bonafide Certificate',
            icon: <FileSignature />,
            action: 'bonafideCertificate',
        },
        {
            label: 'Transfer Certificate',
            icon: <FileX2 />,
            action: 'transferCertificate',
        },
        { label: 'ID Card', icon: <IdCard />, action: 'generateIDCard' },
        {
            label: 'Document Request',
            icon: <ClipboardList />,
            action: 'requestDocument',
        },
        ],
    },
    {
        category: 'Transport & Logistics',
        shortcut: 'J',
        icon: <Bus />,
        itemShortcuts: ['1', '2', '3'],
        items: [
        { label: 'Add Bus Route', icon: <MapPin />, action: 'addRoute' },
        { label: 'Track Bus', icon: <Navigation />, action: 'trackBus' },
        { label: 'Assign Bus', icon: <UserCheck />, action: 'assignBus' },
        ],
    },
    {
        category: 'Monitoring',
        shortcut: 'K',
        icon: <Activity />,
        itemShortcuts: ['1', '2', '3'],
        items: [
        { label: 'Live Attendance', icon: <Eye />, action: 'liveAttendance' },
        { label: 'Classroom Monitor', icon: <Monitor />, action: 'classMonitor' },
        { label: 'Bus GPS', icon: <LocateFixed />, action: 'busGps' },
        ],
    },
    {
        category: 'Settings & Roles',
        shortcut: 'L',
        icon: <Settings />,
        itemShortcuts: ['1', '2', '3', '4'],
        items: [
        { label: 'Manage Roles', icon: <ShieldCheck />, action: 'manageRoles' },
        { label: 'School Profile', icon: <Landmark />, action: 'schoolProfile' },
        {
            label: 'Academic Settings',
            icon: <TimerReset />,
            action: 'academicSettings',
        },
        { label: 'Trash / Archived', icon: <Trash2 />, action: 'viewTrash' },
        ],
    },
    ];
