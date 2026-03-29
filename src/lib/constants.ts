import type { Service, Package, TeamMember, FAQItem, Testimonial, BlogPost, Exercise } from './types';

// ============================================
// Navigation
// ============================================
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Physiotherapy', href: '/services/physio' },
      { label: 'Dietitian', href: '/services/dietitian' },
      { label: 'Body Shaping (LPG/Cavitation)', href: '/services/lpg-body-shaping' },
      { label: 'Electrolysis Hair Removal', href: '/services/electrolysis' },
      { label: 'Gym & Training', href: '/services/gym' },
    ],
  },
  { label: 'E-Coach', href: '/e-coach' },
  { label: 'Packages', href: '/packages' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

// ============================================
// Services Overview
// ============================================
export const SERVICES: Service[] = [
  {
    id: 'svc-physio',
    name: 'Physiotherapy & Rehabilitation',
    slug: 'physio',
    category: 'physio',
    description: 'Comprehensive rehabilitation programs including sports, orthopedic, neurological, pediatric, geriatric, respiratory, and post-pregnancy rehab. Our expert therapists create personalized treatment plans to restore mobility, reduce pain, and improve quality of life.',
    shortDescription: 'Expert rehabilitation for sports injuries, orthopedic conditions, and more.',
    duration: 60,
    price: 75,
    imageUrl: '/images/physio.jpg',
    isActive: true,
  },
  {
    id: 'svc-dietitian',
    name: 'Nutrition & Dietetics',
    slug: 'dietitian',
    category: 'dietitian',
    description: 'Personalized nutrition assessments, custom meal plans, body composition analysis, and ongoing dietitian support. Whether your goal is weight management, performance nutrition, or medical dietary needs.',
    shortDescription: 'Personalized meal plans and nutrition coaching for your health goals.',
    duration: 45,
    price: 60,
    imageUrl: '/images/dietitian.jpg',
    isActive: true,
  },
  {
    id: 'svc-lpg',
    name: 'Body Shaping & Aesthetics',
    slug: 'lpg-body-shaping',
    category: 'aesthetic',
    description: 'Advanced body contouring using LPG endermologie, cavitation, and radio-frequency treatments. Includes fat reduction, body firming, lymphatic drainage, and post-pregnancy body restoration.',
    shortDescription: 'LPG, cavitation, and advanced body contouring treatments.',
    duration: 45,
    price: 90,
    imageUrl: '/images/body-shaping.jpg',
    isActive: true,
  },
  {
    id: 'svc-electrolysis',
    name: 'Electrolysis Hair Removal',
    slug: 'electrolysis',
    category: 'electrolysis',
    description: 'Permanent hair removal using professional electrolysis. Safe for all skin and hair types with customized treatment protocols and aftercare guidance.',
    shortDescription: 'Permanent hair removal safe for all skin types.',
    duration: 30,
    price: 50,
    imageUrl: '/images/electrolysis.jpg',
    isActive: true,
  },
  {
    id: 'svc-gym',
    name: 'Gym & Personal Training',
    slug: 'gym',
    category: 'gym',
    description: 'Modern gym facilities with personal training, group classes, and AI-powered E-Coach. Custom workout programs designed by certified trainers with real-time tracking and progress analytics.',
    shortDescription: 'Personal training, group classes, and AI-powered coaching.',
    duration: 60,
    price: 40,
    imageUrl: '/images/gym.jpg',
    isActive: true,
  },
];

// ============================================
// Physio Specialties
// ============================================
export const PHYSIO_SPECIALTIES = [
  { id: 'sports_rehab', name: 'Sports Rehabilitation', icon: 'Trophy', description: 'Recovery and performance programs for athletes and sports injuries.' },
  { id: 'orthopedic_rehab', name: 'Orthopedic Rehabilitation', icon: 'Bone', description: 'Post-surgery and musculoskeletal condition rehabilitation.' },
  { id: 'rheumatology_rehab', name: 'Rheumatology Rehabilitation', icon: 'Hand', description: 'Management of arthritis, joint, and autoimmune conditions.' },
  { id: 'neurological_rehab', name: 'Neurological Rehabilitation', icon: 'Brain', description: 'Recovery programs for stroke, spinal cord, and neurological conditions.' },
  { id: 'pediatric_rehab', name: 'Pediatric Rehabilitation', icon: 'Baby', description: 'Specialized therapy for children and developmental conditions.' },
  { id: 'geriatric_rehab', name: 'Geriatric Rehabilitation', icon: 'PersonStanding', description: 'Age-related mobility and strength improvement programs.' },
  { id: 'respiratory_rehab', name: 'Respiratory Rehabilitation', icon: 'Wind', description: 'Breathing exercise programs and lung function improvement.' },
  { id: 'post_pregnancy_rehab', name: 'Post-Pregnancy Rehabilitation', icon: 'Heart', description: 'Recovery programs for new mothers, including pelvic floor therapy.' },
];

// ============================================
// Aesthetic Treatments
// ============================================
export const AESTHETIC_TREATMENTS = [
  { id: 'fat_reduction', name: 'Fat Reduction', description: 'Non-invasive fat reduction using cavitation and radio-frequency technology.' },
  { id: 'body_firming', name: 'Body Firming', description: 'Skin tightening and muscle toning treatments for a defined silhouette.' },
  { id: 'lymphatic_drainage', name: 'Lymphatic Drainage', description: 'Manual and machine-assisted drainage to reduce swelling and detoxify.' },
  { id: 'post_pregnancy_aesthetic', name: 'Post-Pregnancy Treatment', description: 'Targeted body restoration programs for new mothers.' },
];

// ============================================
// Packages
// ============================================
export const PACKAGES: Package[] = [
  {
    id: 'pkg-physio-10',
    name: 'Physio 10 Sessions',
    description: 'Ten physiotherapy sessions with a dedicated therapist.',
    category: 'physio',
    type: 'bundle',
    totalSessions: 10,
    price: 650,
    validityDays: 90,
    includesECoach: false,
    features: ['10 in-clinic sessions', 'Dedicated therapist', 'Treatment plan', 'Progress notes', 'Scan upload support'],
  },
  {
    id: 'pkg-physio-lite',
    name: 'Physio Lite',
    description: 'Two PT sessions with AI E-Coach follow-up for maintenance care.',
    category: 'physio',
    type: 'hybrid',
    totalSessions: 2,
    price: 199,
    validityDays: 30,
    includesECoach: true,
    features: ['2 in-clinic PT sessions', 'AI E-Coach daily support', 'Exercise tracking', 'Progress monitoring', 'Pain check-ins'],
    isPopular: true,
  },
  {
    id: 'pkg-physio-premium',
    name: 'Physio Premium',
    description: 'Eight PT sessions plus full AI E-Coach and tracking.',
    category: 'physio',
    type: 'hybrid',
    totalSessions: 8,
    price: 599,
    validityDays: 60,
    includesECoach: true,
    features: ['8 in-clinic PT sessions', 'AI E-Coach full access', 'Exercise tracking', 'Rehab exercise library', 'Priority booking'],
  },
  {
    id: 'pkg-diet-monthly',
    name: 'Dietitian Monthly',
    description: 'Monthly nutrition follow-up with custom meal plans.',
    category: 'dietitian',
    type: 'monthly',
    totalSessions: 4,
    price: 180,
    validityDays: 30,
    includesECoach: false,
    features: ['4 consultations/month', 'Custom meal plan', 'Macros guidance', 'Food diary review', 'Body measurements'],
  },
  {
    id: 'pkg-aesthetic-8',
    name: 'Body Shaping 8 Sessions',
    description: 'Eight aesthetic body contouring sessions.',
    category: 'aesthetic',
    type: 'bundle',
    totalSessions: 8,
    price: 640,
    validityDays: 60,
    includesECoach: false,
    features: ['8 treatment sessions', 'Before/after photos', 'Body measurements', 'Progress timeline', 'Treatment notes'],
    isPopular: true,
  },
  {
    id: 'pkg-hair-area',
    name: 'Hair Removal Area Package',
    description: 'Electrolysis sessions for one target area.',
    category: 'electrolysis',
    type: 'bundle',
    totalSessions: 6,
    price: 250,
    validityDays: 120,
    includesECoach: false,
    features: ['6 sessions per area', 'Skin assessment', 'Aftercare instructions', 'Interval reminders', 'Progress photos'],
  },
  {
    id: 'pkg-gym-monthly',
    name: 'Gym Monthly',
    description: 'Full gym access with a personalized training program.',
    category: 'gym',
    type: 'monthly',
    totalSessions: 30,
    price: 80,
    validityDays: 30,
    includesECoach: false,
    features: ['Unlimited gym access', 'Personal program', 'Trainer support', 'Workout library', 'Attendance tracking'],
  },
  {
    id: 'pkg-gym-ecoach',
    name: 'Gym + E-Coach',
    description: 'Gym access combined with AI coaching at a reduced cost.',
    category: 'gym',
    type: 'hybrid',
    totalSessions: 30,
    price: 120,
    validityDays: 30,
    includesECoach: true,
    features: ['Unlimited gym access', 'AI E-Coach subscription', 'Adaptive workout plans', 'Exercise videos', 'Performance dashboard'],
    isPopular: true,
  },
  {
    id: 'pkg-ecoach-monthly',
    name: 'E-Coach Monthly',
    description: 'AI-powered coaching subscription without in-person visits.',
    category: 'gym',
    type: 'monthly',
    totalSessions: 0,
    price: 29,
    validityDays: 30,
    includesECoach: true,
    features: ['AI workout plans', 'Exercise library', 'Progress tracking', 'Daily reminders', 'Chat assistant'],
  },
];

// ============================================
// Team Members
// ============================================
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Nicolas Khoury',
    role: 'therapist',
    title: 'Founder & Head Physiotherapist',
    bio: 'With over 15 years of experience in sports and orthopedic rehabilitation, Dr. Nicolas leads our clinical team with a patient-centered approach.',
    imageUrl: '/images/team/nicolas.jpg',
    specialties: ['Sports Rehab', 'Orthopedic Rehab', 'Manual Therapy'],
    languages: ['English', 'Arabic', 'French'],
  },
  {
    id: 'tm-2',
    name: 'Sarah Mansour',
    role: 'dietitian',
    title: 'Clinical Dietitian',
    bio: 'Sarah specializes in sports nutrition and weight management, creating evidence-based meal plans tailored to each client\'s lifestyle.',
    imageUrl: '/images/team/sarah.jpg',
    specialties: ['Sports Nutrition', 'Weight Management', 'Medical Diets'],
    languages: ['English', 'Arabic'],
  },
  {
    id: 'tm-3',
    name: 'Lara Haddad',
    role: 'aesthetic_specialist',
    title: 'Aesthetic Specialist',
    bio: 'Certified in LPG endermologie and body contouring, Lara brings precision and care to every aesthetic treatment.',
    imageUrl: '/images/team/lara.jpg',
    specialties: ['LPG Endermologie', 'Body Contouring', 'Lymphatic Drainage'],
    languages: ['English', 'Arabic', 'French'],
  },
  {
    id: 'tm-4',
    name: 'Ahmad Rizk',
    role: 'trainer',
    title: 'Head Gym Coach',
    bio: 'Ahmad is a certified personal trainer and strength coach with a focus on functional fitness and rehabilitation exercise programming.',
    imageUrl: '/images/team/ahmad.jpg',
    specialties: ['Personal Training', 'Strength & Conditioning', 'Functional Fitness'],
    languages: ['English', 'Arabic'],
  },
  {
    id: 'tm-5',
    name: 'Maya Abboud',
    role: 'therapist',
    title: 'Neurological Physiotherapist',
    bio: 'Maya specializes in neurological rehabilitation, working with stroke survivors, spinal cord injuries, and neurodegenerative conditions.',
    imageUrl: '/images/team/maya.jpg',
    specialties: ['Neurological Rehab', 'Stroke Recovery', 'Pediatric Rehab'],
    languages: ['English', 'Arabic'],
  },
  {
    id: 'tm-6',
    name: 'Nour Khalil',
    role: 'aesthetic_specialist',
    title: 'Electrolysis Specialist',
    bio: 'Nour has years of experience in permanent hair removal, providing safe and effective electrolysis treatments for all skin types.',
    imageUrl: '/images/team/nour.jpg',
    specialties: ['Electrolysis', 'Skin Care', 'Hair Removal'],
    languages: ['English', 'Arabic'],
  },
];

// ============================================
// FAQ
// ============================================
export const FAQ_ITEMS: FAQItem[] = [
  { category: 'General', question: 'What services does Nicolas Web offer?', answer: 'We offer physiotherapy and rehabilitation, nutrition and dietetics, body shaping (LPG/Cavitation), electrolysis hair removal, gym and personal training, and an AI-powered E-Coach system.' },
  { category: 'General', question: 'How do I book an appointment?', answer: 'You can book an appointment through our online booking system, by calling our reception, or via WhatsApp. Simply select your service, preferred specialist, and choose an available time slot.' },
  { category: 'General', question: 'What are your operating hours?', answer: 'We are open Monday to Friday from 8:00 AM to 8:00 PM, and Saturday from 9:00 AM to 4:00 PM. Sunday is closed.' },
  { category: 'Physio', question: 'Do I need a referral to see a physiotherapist?', answer: 'No referral is needed. You can book directly. However, if you have medical reports or scans, please bring them to your first session.' },
  { category: 'Physio', question: 'How many physio sessions will I need?', answer: 'The number of sessions varies depending on your condition. After your initial assessment, your therapist will recommend a treatment plan with an estimated number of sessions.' },
  { category: 'Dietitian', question: 'What happens in a dietitian consultation?', answer: 'Your first consultation includes a full nutrition assessment, body measurements, goal setting, and your first customized meal plan. Follow-up sessions track progress.' },
  { category: 'Aesthetic', question: 'Is LPG treatment painful?', answer: 'LPG endermologie is a non-invasive, painless treatment. Most clients describe it as a deep tissue massage sensation.' },
  { category: 'Aesthetic', question: 'How many body shaping sessions do I need?', answer: 'Most clients see results after 6-8 sessions. We recommend our 8-session body shaping package for optimal results.' },
  { category: 'Electrolysis', question: 'Is electrolysis permanent?', answer: 'Yes, electrolysis is the only FDA-approved permanent hair removal method. It works on all skin and hair types.' },
  { category: 'Gym', question: 'Do I get a personal trainer with my gym membership?', answer: 'Your membership includes an initial program design by a trainer. For ongoing personal training, you can add PT sessions or subscribe to our E-Coach.' },
  { category: 'E-Coach', question: 'What is the E-Coach?', answer: 'The E-Coach is our AI-powered coaching assistant that provides personalized workout plans, daily exercise reminders, pain check-ins, and progress tracking — at a fraction of in-person training cost.' },
  { category: 'E-Coach', question: 'Can E-Coach replace a personal trainer?', answer: 'E-Coach is designed as a coaching support tool, not a replacement. It works best combined with periodic in-person sessions for assessment and plan adjustments.' },
  { category: 'Payments', question: 'What payment methods do you accept?', answer: 'We accept cash, credit/debit cards, and bank transfers. Package payments can be split or paid upfront with a discount.' },
  { category: 'Payments', question: 'Can I cancel or reschedule my appointment?', answer: 'Yes, you can cancel or reschedule up to 24 hours before your appointment through the client portal or by contacting reception.' },
];

// ============================================
// Testimonials
// ============================================
export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', clientName: 'Rami S.', service: 'Physiotherapy', content: 'After my knee surgery, the team at Nicolas Web guided me through a complete recovery. The exercise tracking system made it easy to follow my program at home.', rating: 5 },
  { id: 't2', clientName: 'Diana M.', service: 'Dietitian', content: 'Sarah helped me completely transform my eating habits. The meal plans were realistic and delicious. I lost 8kg in 3 months!', rating: 5 },
  { id: 't3', clientName: 'Lea K.', service: 'Body Shaping', content: 'The LPG treatments were amazing. I could see results after just 4 sessions. The before/after tracking really motivated me to keep going.', rating: 5 },
  { id: 't4', clientName: 'Jad H.', service: 'Gym + E-Coach', content: 'The E-Coach is a game changer. I get AI-guided workouts every day and I only need to see my trainer once a month. Incredible value.', rating: 5 },
  { id: 't5', clientName: 'Nadia A.', service: 'Electrolysis', content: 'Finally a permanent solution. The team was professional and made the whole process comfortable. Highly recommend.', rating: 5 },
];

// ============================================
// Blog Posts
// ============================================
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Exercises to Improve Your Posture at Your Desk',
    slug: '5-exercises-improve-posture-desk',
    excerpt: 'Spending long hours at your desk? These five simple exercises can help prevent back pain and improve your posture throughout the day.',
    content: '',
    imageUrl: '/images/blog/posture.jpg',
    author: 'Dr. Nicolas Khoury',
    category: 'Physiotherapy',
    publishedAt: '2026-03-15',
    tags: ['posture', 'exercise', 'back pain', 'office'],
  },
  {
    id: 'blog-2',
    title: 'Understanding Macros: A Beginner\'s Guide',
    slug: 'understanding-macros-beginners-guide',
    excerpt: 'Learn the basics of macronutrients — proteins, carbohydrates, and fats — and how to balance them for your specific health goals.',
    content: '',
    imageUrl: '/images/blog/macros.jpg',
    author: 'Sarah Mansour',
    category: 'Nutrition',
    publishedAt: '2026-03-10',
    tags: ['nutrition', 'macros', 'diet', 'healthy eating'],
  },
  {
    id: 'blog-3',
    title: 'How AI is Transforming Rehabilitation',
    slug: 'ai-transforming-rehabilitation',
    excerpt: 'Discover how artificial intelligence and digital coaching are making rehabilitation more accessible, personalized, and effective.',
    content: '',
    imageUrl: '/images/blog/ai-rehab.jpg',
    author: 'Dr. Nicolas Khoury',
    category: 'Technology',
    publishedAt: '2026-03-05',
    tags: ['AI', 'rehabilitation', 'e-coach', 'technology'],
  },
  {
    id: 'blog-4',
    title: 'LPG Endermologie: What You Need to Know',
    slug: 'lpg-endermologie-what-to-know',
    excerpt: 'Everything about LPG endermologie — how it works, expected results, session frequency, and who it\'s best suited for.',
    content: '',
    imageUrl: '/images/blog/lpg.jpg',
    author: 'Lara Haddad',
    category: 'Aesthetics',
    publishedAt: '2026-02-28',
    tags: ['LPG', 'body shaping', 'aesthetics', 'fat reduction'],
  },
];

// ============================================
// Sample Exercises
// ============================================
export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Wall Squats',
    muscleGroup: 'lower_body',
    category: 'Strength',
    difficulty: 'beginner',
    description: 'A great exercise for building quad strength while protecting the knees.',
    instructions: ['Stand with your back flat against a wall', 'Slide down until your thighs are parallel to the floor', 'Hold the position for the prescribed time', 'Slowly slide back up'],
    precautions: ['Stop if you feel sharp knee pain', 'Keep your back flat against the wall'],
    videoUrl: '/videos/wall-squats.mp4',
    imageUrl: '/images/exercises/wall-squats.jpg',
  },
  {
    id: 'ex-2',
    name: 'Resistance Band Rows',
    muscleGroup: 'upper_body',
    category: 'Strength',
    difficulty: 'beginner',
    description: 'Strengthens the upper back and improves posture.',
    instructions: ['Secure the band at chest height', 'Grip both ends with arms extended', 'Pull the band toward your chest, squeezing shoulder blades', 'Slowly return to start'],
    precautions: ['Maintain a neutral spine', 'Do not jerk the band'],
    videoUrl: '/videos/band-rows.mp4',
    imageUrl: '/images/exercises/band-rows.jpg',
  },
  {
    id: 'ex-3',
    name: 'Planks',
    muscleGroup: 'core',
    category: 'Stability',
    difficulty: 'intermediate',
    description: 'Core stabilization exercise that strengthens the entire core.',
    instructions: ['Place forearms on the floor, elbows under shoulders', 'Extend legs straight behind you', 'Engage your core and hold', 'Keep your body in a straight line'],
    precautions: ['Do not let hips sag', 'Breathe normally throughout'],
    videoUrl: '/videos/planks.mp4',
    imageUrl: '/images/exercises/planks.jpg',
  },
  {
    id: 'ex-4',
    name: 'Hamstring Stretch',
    muscleGroup: 'flexibility',
    category: 'Flexibility',
    difficulty: 'beginner',
    description: 'Improves hamstring flexibility and reduces lower back tension.',
    instructions: ['Lie on your back', 'Raise one leg straight up', 'Hold behind the thigh or calf', 'Gently pull the leg toward you until you feel a stretch'],
    precautions: ['Do not bounce', 'Keep the opposite leg flat on the floor'],
    videoUrl: '/videos/hamstring-stretch.mp4',
    imageUrl: '/images/exercises/hamstring-stretch.jpg',
  },
  {
    id: 'ex-5',
    name: 'Single Leg Balance',
    muscleGroup: 'balance',
    category: 'Balance',
    difficulty: 'beginner',
    description: 'Improves balance and proprioception, essential for injury prevention.',
    instructions: ['Stand on one foot', 'Keep your gaze fixed on a point ahead', 'Hold for the prescribed time', 'Switch legs'],
    precautions: ['Stand near a wall for safety', 'Stop if you feel dizzy'],
    videoUrl: '/videos/single-leg-balance.mp4',
    imageUrl: '/images/exercises/single-leg-balance.jpg',
  },
];

// ============================================
// Company Info
// ============================================
export const COMPANY = {
  name: 'Nicolas Web',
  tagline: 'Digital Wellness & Rehabilitation System',
  description: 'A comprehensive digital health platform combining expert clinical care with AI-powered coaching for physiotherapy, nutrition, aesthetics, and fitness.',
  phone: '+961 XX XXX XXX',
  email: 'info@nicolasweb.com',
  address: 'Beirut, Lebanon',
  workingHours: {
    weekdays: '8:00 AM – 8:00 PM',
    saturday: '9:00 AM – 4:00 PM',
    sunday: 'Closed',
  },
  social: {
    instagram: '#',
    facebook: '#',
    whatsapp: '#',
    linkedin: '#',
  },
};
