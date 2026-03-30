import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.staffServiceAccess.deleteMany();
  await prisma.eCoachMessage.deleteMany();
  await prisma.eCoachConversation.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.exerciseAssignment.deleteMany();
  await prisma.treatmentNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.packageService.deleteMany();
  await prisma.package.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.service.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.fAQItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const passwordHash = await hash('password123', 12);

  // ─── Organization ─────────────────────────────────────────
  const org = await prisma.organization.create({
    data: {
      name: 'Back in Motion',
      slug: 'back-in-motion',
      email: 'info@backinmotion.com',
      phone: '+961 1 234 567',
      address: 'Beirut, Lebanon',
      website: 'https://backinmotion.com',
      timezone: 'Asia/Beirut',
      currency: 'USD',
      settings: JSON.stringify({
        businessHours: {
          weekdays: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '16:00' },
          sunday: null,
        },
      }),
    },
  });

  console.log('Organization created');

  // ─── Super Admin (platform owner) ────────────────────────
  await prisma.user.create({
    data: {
      email: 'superadmin@backinmotion.com',
      passwordHash,
      firstName: 'Stephan',
      lastName: 'El Khoury',
      phone: '+961 3 000 000',
      role: 'super_admin',
      // super_admin has no organization - they manage all orgs
    },
  });

  console.log('Super Admin created');

  // ─── Users ────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@backinmotion.com',
      passwordHash,
      firstName: 'Nicolas',
      lastName: 'Khoury',
      phone: '+961 1 234 567',
      role: 'admin',
      organizationId: org.id,
      bio: 'Founder & Director of Back in Motion. 15+ years in physiotherapy and rehabilitation.',
      specialties: JSON.stringify(['Practice Management', 'Sports Rehabilitation']),
      languages: JSON.stringify(['English', 'Arabic', 'French']),
    },
  });

  const therapist1 = await prisma.user.create({
    data: {
      email: 'karim@backinmotion.com',
      passwordHash,
      firstName: 'Karim',
      lastName: 'Nassar',
      phone: '+961 71 111 111',
      role: 'therapist',
      organizationId: org.id,
      bio: 'Sports rehabilitation specialist with 10 years of experience.',
      specialties: JSON.stringify(['Sports Rehab', 'Post-Surgery Recovery', 'Orthopedic Rehab']),
      languages: JSON.stringify(['English', 'Arabic']),
    },
  });

  const therapist2 = await prisma.user.create({
    data: {
      email: 'lina@backinmotion.com',
      passwordHash,
      firstName: 'Lina',
      lastName: 'Fadel',
      phone: '+961 71 222 222',
      role: 'therapist',
      organizationId: org.id,
      bio: 'Neurological and geriatric rehabilitation expert.',
      specialties: JSON.stringify(['Neuro Rehab', 'Geriatric Rehab', 'Chronic Pain']),
      languages: JSON.stringify(['English', 'Arabic', 'French']),
    },
  });

  const dietitian = await prisma.user.create({
    data: {
      email: 'maya@backinmotion.com',
      passwordHash,
      firstName: 'Maya',
      lastName: 'Touma',
      phone: '+961 71 333 333',
      role: 'dietitian',
      organizationId: org.id,
      bio: 'Certified dietitian specializing in sports nutrition and weight management.',
      specialties: JSON.stringify(['Weight Management', 'Sports Nutrition', 'Clinical Nutrition']),
      languages: JSON.stringify(['English', 'Arabic']),
    },
  });

  const aesthetician = await prisma.user.create({
    data: {
      email: 'nour@backinmotion.com',
      passwordHash,
      firstName: 'Nour',
      lastName: 'Sabbagh',
      phone: '+961 71 444 444',
      role: 'aesthetic_specialist',
      organizationId: org.id,
      bio: 'LPG Endermologie and body contouring expert.',
      specialties: JSON.stringify(['LPG Endermologie', 'Cavitation', 'RF Skin Tightening']),
      languages: JSON.stringify(['English', 'Arabic', 'French']),
    },
  });

  const trainer = await prisma.user.create({
    data: {
      email: 'tony@backinmotion.com',
      passwordHash,
      firstName: 'Tony',
      lastName: 'Makhlouf',
      phone: '+961 71 555 555',
      role: 'trainer',
      organizationId: org.id,
      bio: 'Certified personal trainer with focus on strength and HIIT.',
      specialties: JSON.stringify(['Strength Training', 'HIIT', 'Functional Fitness']),
      languages: JSON.stringify(['English', 'Arabic']),
    },
  });

  const electrologist = await prisma.user.create({
    data: {
      email: 'sara@backinmotion.com',
      passwordHash,
      firstName: 'Sara',
      lastName: 'Hanna',
      phone: '+961 71 666 666',
      role: 'electrologist',
      organizationId: org.id,
      bio: 'Experienced electrologist specializing in permanent hair removal.',
      specialties: JSON.stringify(['Thermolysis', 'Blend Method', 'Galvanic']),
      languages: JSON.stringify(['English', 'Arabic']),
    },
  });

  // Demo client
  const client1 = await prisma.user.create({
    data: {
      email: 'rami@example.com',
      passwordHash,
      firstName: 'Rami',
      lastName: 'Saleh',
      phone: '+961 71 123 456',
      role: 'client',
      organizationId: org.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      medicalNotes: 'ACL reconstruction 3 months ago. Cleared for rehabilitation.',
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'diana@example.com',
      passwordHash,
      firstName: 'Diana',
      lastName: 'Mansour',
      phone: '+961 70 234 567',
      role: 'client',
      organizationId: org.id,
      dateOfBirth: new Date('1988-09-22'),
      gender: 'female',
      medicalNotes: 'Seeking weight management and nutrition guidance.',
    },
  });

  const client3 = await prisma.user.create({
    data: {
      email: 'demo@backinmotion.com',
      passwordHash: await hash('demo123', 12),
      firstName: 'Demo',
      lastName: 'User',
      phone: '+961 70 000 000',
      role: 'client',
      organizationId: org.id,
      dateOfBirth: new Date('1995-01-10'),
      gender: 'female',
    },
  });

  console.log('Users created');

  // ─── Services ─────────────────────────────────────────────
  const physioService = await prisma.service.create({
    data: {
      name: 'Physiotherapy',
      slug: 'physio',
      category: 'physio',
      description: 'Expert physiotherapy and rehabilitation services for sports injuries, post-surgical recovery, chronic pain, neurological conditions, and more.',
      shortDescription: 'Expert rehabilitation & pain management',
      duration: 60,
      price: 75,
      organizationId: org.id,
    },
  });

  const dietService = await prisma.service.create({
    data: {
      name: 'Dietitian / Nutrition',
      slug: 'dietitian',
      category: 'dietitian',
      description: 'Personalized nutrition plans, meal tracking, and dietary guidance for weight management, sports nutrition, and clinical conditions.',
      shortDescription: 'Custom meal plans & nutrition coaching',
      duration: 45,
      price: 60,
      organizationId: org.id,
    },
  });

  const lpgService = await prisma.service.create({
    data: {
      name: 'LPG & Body Shaping',
      slug: 'lpg-body-shaping',
      category: 'aesthetic',
      description: 'Advanced body contouring with LPG Endermologie, cavitation, radiofrequency, and lymphatic drainage treatments.',
      shortDescription: 'Non-invasive body contouring & skin firming',
      duration: 50,
      price: 90,
      organizationId: org.id,
    },
  });

  const electroService = await prisma.service.create({
    data: {
      name: 'Electrolysis Hair Removal',
      slug: 'electrolysis',
      category: 'electrolysis',
      description: 'FDA-approved permanent hair removal using thermolysis, galvanic, and blend methods for all skin and hair types.',
      shortDescription: 'Permanent hair removal for all skin types',
      duration: 30,
      price: 50,
      organizationId: org.id,
    },
  });

  const gymService = await prisma.service.create({
    data: {
      name: 'Gym & Fitness',
      slug: 'gym',
      category: 'gym',
      description: 'Guided fitness programs including strength training, HIIT, functional fitness, and rehab-friendly workouts with AI tracking.',
      shortDescription: 'Guided workouts & fitness programs',
      duration: 60,
      price: 40,
      organizationId: org.id,
    },
  });

  console.log('Services created');

  // ─── Packages ─────────────────────────────────────────────
  const pkg1 = await prisma.package.create({
    data: {
      name: 'Physio 10 Sessions',
      description: 'Ten physiotherapy sessions with a dedicated therapist.',
      category: 'physio',
      type: 'bundle',
      totalSessions: 10,
      price: 650,
      validityDays: 90,
      organizationId: org.id,
      features: JSON.stringify(['10 in-clinic sessions', 'Dedicated therapist', 'Treatment plan', 'Progress notes', 'Scan upload support']),
      services: { create: { serviceId: physioService.id } },
    },
  });

  const pkg2 = await prisma.package.create({
    data: {
      name: 'Physio Lite',
      description: 'Two PT sessions with AI E-Coach follow-up for maintenance care.',
      category: 'physio',
      type: 'hybrid',
      totalSessions: 2,
      price: 199,
      validityDays: 30,
      includesECoach: true,
      isPopular: true,
      organizationId: org.id,
      features: JSON.stringify(['2 in-clinic PT sessions', 'AI E-Coach daily support', 'Exercise tracking', 'Progress monitoring', 'Pain check-ins']),
      services: { create: { serviceId: physioService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'Physio Premium',
      description: 'Eight PT sessions plus full AI E-Coach and tracking.',
      category: 'physio',
      type: 'hybrid',
      totalSessions: 8,
      price: 599,
      validityDays: 60,
      includesECoach: true,
      organizationId: org.id,
      features: JSON.stringify(['8 in-clinic PT sessions', 'AI E-Coach full access', 'Exercise tracking', 'Rehab exercise library', 'Priority booking']),
      services: { create: { serviceId: physioService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'Dietitian Monthly',
      description: 'Monthly nutrition follow-up with custom meal plans.',
      category: 'dietitian',
      type: 'monthly',
      totalSessions: 4,
      price: 180,
      validityDays: 30,
      organizationId: org.id,
      features: JSON.stringify(['4 consultations/month', 'Custom meal plan', 'Macros guidance', 'Food diary review', 'Body measurements']),
      services: { create: { serviceId: dietService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'Body Shaping 8 Sessions',
      description: 'Eight LPG Endermologie or cavitation body shaping sessions.',
      category: 'aesthetic',
      type: 'bundle',
      totalSessions: 8,
      price: 640,
      validityDays: 60,
      isPopular: true,
      organizationId: org.id,
      features: JSON.stringify(['8 treatment sessions', 'Body assessment', 'Progress photos', 'Treatment plan', 'Aftercare guidance']),
      services: { create: { serviceId: lpgService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'Hair Removal Area Package',
      description: 'Electrolysis sessions for a single treatment area.',
      category: 'electrolysis',
      type: 'bundle',
      totalSessions: 12,
      price: 480,
      validityDays: 120,
      organizationId: org.id,
      features: JSON.stringify(['12 sessions per area', 'All skin/hair types', 'Consultation included', 'Aftercare support', 'Touch-up sessions']),
      services: { create: { serviceId: electroService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'Gym Monthly',
      description: 'Unlimited gym access with personalized training.',
      category: 'gym',
      type: 'monthly',
      totalSessions: 20,
      price: 100,
      validityDays: 30,
      organizationId: org.id,
      features: JSON.stringify(['Unlimited gym access', 'Custom workout plan', 'Monthly assessment', 'Locker & amenities', 'App tracking']),
      services: { create: { serviceId: gymService.id } },
    },
  });

  const gymEcoachPkg = await prisma.package.create({
    data: {
      name: 'Gym + E-Coach',
      description: 'Gym access with AI-powered E-Coach for daily guidance.',
      category: 'gym',
      type: 'hybrid',
      totalSessions: 20,
      price: 149,
      validityDays: 30,
      includesECoach: true,
      isPopular: true,
      organizationId: org.id,
      features: JSON.stringify(['Unlimited gym access', 'AI E-Coach support', 'Smart workout tracking', 'Nutrition tips', 'Progress analytics']),
      services: { create: { serviceId: gymService.id } },
    },
  });

  await prisma.package.create({
    data: {
      name: 'E-Coach Standalone',
      description: 'AI-powered wellness coach without in-clinic sessions.',
      category: 'hybrid',
      type: 'monthly',
      totalSessions: 0,
      price: 29,
      validityDays: 30,
      includesECoach: true,
      organizationId: org.id,
      features: JSON.stringify(['AI E-Coach 24/7', 'Exercise library access', 'Daily check-ins', 'Progress tracking', 'Wellness tips']),
    },
  });

  console.log('Packages created');

  // ─── Exercises ────────────────────────────────────────────
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: 'Wall Squats',
        description: 'Strengthen quadriceps and glutes with back support.',
        category: 'strength',
        muscleGroup: 'lower_body',
        difficulty: 'beginner',
        instructions: JSON.stringify(['Stand with back flat against wall', 'Slide down to 90° knee bend', 'Hold position for prescribed time', 'Slowly slide back up']),
        precautions: JSON.stringify(['Stop if sharp knee pain', 'Keep knees behind toes']),
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Resistance Band Rows',
        description: 'Strengthen upper back and improve posture.',
        category: 'strength',
        muscleGroup: 'upper_body',
        difficulty: 'beginner',
        instructions: JSON.stringify(['Anchor band at chest height', 'Pull band towards chest', 'Squeeze shoulder blades together', 'Slowly return to start']),
        precautions: JSON.stringify(['Avoid jerking motions', 'Maintain neutral spine']),
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Plank Hold',
        description: 'Core stabilization exercise for trunk strength.',
        category: 'strength',
        muscleGroup: 'core',
        difficulty: 'intermediate',
        instructions: JSON.stringify(['Forearms on floor, elbows under shoulders', 'Body in straight line from head to heels', 'Engage core and hold', 'Breathe steadily']),
        precautions: JSON.stringify(['Stop if lower back pain', 'Modify to knees if needed']),
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Hamstring Stretch',
        description: 'Improve posterior chain flexibility.',
        category: 'flexibility',
        muscleGroup: 'lower_body',
        difficulty: 'beginner',
        instructions: JSON.stringify(['Lie on back, one leg raised', 'Loop strap around foot', 'Gently pull leg towards chest', 'Hold for 30 seconds, switch']),
        precautions: JSON.stringify(['No bouncing', 'Mild stretch only, no pain']),
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Single Leg Balance',
        description: 'Improve proprioception and ankle stability.',
        category: 'balance',
        muscleGroup: 'lower_body',
        difficulty: 'beginner',
        instructions: JSON.stringify(['Stand on one leg', 'Keep hips level', 'Hold for 30 seconds', 'Switch legs and repeat']),
        precautions: JSON.stringify(['Stand near wall for safety', 'Keep eyes focused on fixed point']),
      },
    }),
  ]);

  console.log('Exercises created');

  // ─── Subscriptions for demo clients ───────────────────────
  const sub1 = await prisma.subscription.create({
    data: {
      clientId: client1.id,
      packageId: pkg1.id,
      sessionsTotal: 10,
      sessionsUsed: 6,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-04-15'),
    },
  });

  await prisma.subscription.create({
    data: {
      clientId: client2.id,
      packageId: pkg2.id,
      sessionsTotal: 2,
      sessionsUsed: 1,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
    },
  });

  await prisma.subscription.create({
    data: {
      clientId: client3.id,
      packageId: gymEcoachPkg.id,
      sessionsTotal: 20,
      sessionsUsed: 8,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
    },
  });

  console.log('Subscriptions created');

  // ─── Appointments ─────────────────────────────────────────
  const apt1 = await prisma.appointment.create({
    data: {
      clientId: client1.id,
      practitionerId: therapist1.id,
      serviceId: physioService.id,
      status: 'completed',
      date: new Date('2026-03-20'),
      startTime: '10:00',
      endTime: '11:00',
      bookingType: 'package',
      subscriptionId: sub1.id,
      notes: 'Post-ACL rehab session 6. Good progress.',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: client1.id,
      practitionerId: therapist1.id,
      serviceId: physioService.id,
      status: 'scheduled',
      date: new Date('2026-03-31'),
      startTime: '10:00',
      endTime: '11:00',
      bookingType: 'package',
      subscriptionId: sub1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: client2.id,
      practitionerId: dietitian.id,
      serviceId: dietService.id,
      status: 'confirmed',
      date: new Date('2026-03-30'),
      startTime: '14:00',
      endTime: '14:45',
      bookingType: 'single',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: client3.id,
      practitionerId: trainer.id,
      serviceId: gymService.id,
      status: 'scheduled',
      date: new Date('2026-03-30'),
      startTime: '09:00',
      endTime: '10:00',
      bookingType: 'package',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: client3.id,
      practitionerId: aesthetician.id,
      serviceId: lpgService.id,
      status: 'scheduled',
      date: new Date('2026-04-02'),
      startTime: '11:00',
      endTime: '11:50',
      bookingType: 'single',
    },
  });

  console.log('Appointments created');

  // ─── Treatment Notes ──────────────────────────────────────
  await prisma.treatmentNote.create({
    data: {
      appointmentId: apt1.id,
      clientId: client1.id,
      practitionerId: therapist1.id,
      subjective: 'Client reports mild discomfort in left knee during stairs.',
      objective: 'ROM: 0-120°. Mild swelling. Quad strength 4/5.',
      assessment: 'Progressing well post-ACL reconstruction. On track for week 14.',
      plan: 'Continue quad strengthening. Add mini squats. Progress to step-ups next session.',
      painBefore: 4,
      painAfter: 2,
    },
  });

  console.log('Treatment notes created');

  // ─── Exercise Assignments ─────────────────────────────────
  const assignment1 = await prisma.exerciseAssignment.create({
    data: {
      clientId: client1.id,
      exerciseId: exercises[0].id,
      assignedBy: therapist1.id,
      sets: 3,
      reps: 12,
      holdSeconds: 5,
      frequency: 'daily',
      painLimitNote: 'Stop if knee pain exceeds 3/10',
    },
  });

  await prisma.exerciseAssignment.create({
    data: {
      clientId: client1.id,
      exerciseId: exercises[3].id,
      assignedBy: therapist1.id,
      sets: 2,
      reps: 1,
      holdSeconds: 30,
      frequency: 'daily',
      painLimitNote: 'Mild stretch only',
    },
  });

  await prisma.exerciseAssignment.create({
    data: {
      clientId: client3.id,
      exerciseId: exercises[2].id,
      assignedBy: trainer.id,
      sets: 3,
      reps: 1,
      holdSeconds: 30,
      frequency: '3x_week',
    },
  });

  // Workout logs
  await prisma.workoutLog.create({
    data: {
      assignmentId: assignment1.id,
      clientId: client1.id,
      setsCompleted: 3,
      repsCompleted: 12,
      painLevel: 2,
      difficulty: 'just_right',
      completedAt: new Date('2026-03-28'),
    },
  });

  await prisma.workoutLog.create({
    data: {
      assignmentId: assignment1.id,
      clientId: client1.id,
      setsCompleted: 3,
      repsCompleted: 10,
      painLevel: 3,
      difficulty: 'too_hard',
      completedAt: new Date('2026-03-27'),
    },
  });

  console.log('Exercise assignments & logs created');

  // ─── Body Measurements ────────────────────────────────────
  await prisma.bodyMeasurement.createMany({
    data: [
      { clientId: client2.id, weight: 72, height: 165, bmi: 26.4, bodyFat: 28, waist: 82, hips: 98, measuredAt: new Date('2026-03-01') },
      { clientId: client2.id, weight: 70.5, height: 165, bmi: 25.9, bodyFat: 27, waist: 80, hips: 97, measuredAt: new Date('2026-03-15') },
      { clientId: client2.id, weight: 69, height: 165, bmi: 25.3, bodyFat: 26, waist: 78, hips: 96, measuredAt: new Date('2026-03-29') },
    ],
  });

  console.log('Body measurements created');

  // ─── E-Coach Conversations ────────────────────────────────
  const convo = await prisma.eCoachConversation.create({
    data: {
      clientId: client3.id,
      title: 'Daily Check-in',
      messages: {
        createMany: {
          data: [
            { role: 'assistant', content: 'Good morning! How are you feeling today? Any pain or discomfort to report?', createdAt: new Date('2026-03-29T08:00:00') },
            { role: 'user', content: 'Hi! Feeling good. Slight soreness in my core from yesterday\'s plank session.', createdAt: new Date('2026-03-29T08:05:00') },
            { role: 'assistant', content: 'That\'s normal muscle soreness from your plank holds — a sign your core is getting stronger! 💪 Make sure to do some gentle stretches today. Want me to suggest a cooldown routine?', createdAt: new Date('2026-03-29T08:06:00') },
            { role: 'user', content: 'Yes please!', createdAt: new Date('2026-03-29T08:07:00') },
            { role: 'assistant', content: 'Here\'s a 5-minute cooldown:\n1. Cat-Cow stretch (10 reps)\n2. Child\'s pose (30 sec hold)\n3. Seated spinal twist (20 sec each side)\n4. Supine knee-to-chest (20 sec each)\n\nTake it easy and listen to your body. Your next scheduled workout is tomorrow — Plank Hold 3x30s. You\'re on a great streak! 🎯', createdAt: new Date('2026-03-29T08:08:00') },
          ],
        },
      },
    },
  });

  console.log('E-Coach conversations created');

  // ─── Payments ─────────────────────────────────────────────
  const payment1 = await prisma.payment.create({
    data: {
      clientId: client1.id,
      amount: 650,
      method: 'credit_card',
      status: 'completed',
      description: 'Physio 10 Sessions package',
      transactionRef: 'TXN-001',
      createdAt: new Date('2026-01-15'),
    },
  });

  await prisma.invoice.create({
    data: {
      paymentId: payment1.id,
      invoiceNumber: 'INV-2026-001',
      items: JSON.stringify([{ description: 'Physio 10 Sessions', quantity: 1, unitPrice: 650, total: 650 }]),
      subtotal: 650,
      tax: 0,
      total: 650,
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      clientId: client3.id,
      amount: 149,
      method: 'credit_card',
      status: 'completed',
      description: 'Gym + E-Coach monthly',
      transactionRef: 'TXN-002',
      createdAt: new Date('2026-03-01'),
    },
  });

  await prisma.invoice.create({
    data: {
      paymentId: payment2.id,
      invoiceNumber: 'INV-2026-002',
      items: JSON.stringify([{ description: 'Gym + E-Coach monthly', quantity: 1, unitPrice: 149, total: 149 }]),
      subtotal: 149,
      tax: 0,
      total: 149,
    },
  });

  console.log('Payments & invoices created');

  // ─── Reminders ────────────────────────────────────────────
  await prisma.reminder.createMany({
    data: [
      { userId: client1.id, type: 'appointment', channel: 'push', title: 'Upcoming Session', message: 'You have a physiotherapy session tomorrow at 10:00 AM with Dr. Karim.', scheduledAt: new Date('2026-03-30T09:00:00') },
      { userId: client1.id, type: 'exercise', channel: 'push', title: 'Daily Exercises', message: 'Time for your daily rehab exercises! Wall Squats & Hamstring Stretch.', scheduledAt: new Date('2026-03-29T08:00:00'), sentAt: new Date('2026-03-29T08:00:00') },
      { userId: client3.id, type: 'exercise', channel: 'push', title: 'Workout Reminder', message: 'Plank Hold session scheduled for today. 3 sets x 30 seconds.', scheduledAt: new Date('2026-03-29T08:00:00'), sentAt: new Date('2026-03-29T08:00:00') },
      { userId: client2.id, type: 'appointment', channel: 'whatsapp', title: 'Dietitian Appointment', message: 'Your nutrition consultation with Maya is tomorrow at 2:00 PM.', scheduledAt: new Date('2026-03-29T14:00:00'), sentAt: new Date('2026-03-29T14:00:00') },
    ],
  });

  console.log('Reminders created');

  // ─── Blog Posts ───────────────────────────────────────────
  await prisma.blogPost.createMany({
    data: [
      { title: '5 Tips for Better Posture at Work', slug: 'better-posture-tips', excerpt: 'Simple adjustments to reduce neck and back pain during long work hours.', content: 'Full article content about posture tips...', author: 'Dr. Karim Nassar', category: 'Physiotherapy', tags: JSON.stringify(['posture', 'back pain', 'ergonomics']), publishedAt: new Date('2026-03-15') },
      { title: 'Understanding Macros for Weight Loss', slug: 'understanding-macros', excerpt: 'A dietitian\'s guide to balancing proteins, carbs, and fats.', content: 'Full article content about macros...', author: 'Maya Touma', category: 'Nutrition', tags: JSON.stringify(['nutrition', 'weight loss', 'macros']), publishedAt: new Date('2026-03-10') },
      { title: 'How AI is Transforming Rehabilitation', slug: 'ai-in-rehabilitation', excerpt: 'The future of physiotherapy with AI-powered exercise coaching.', content: 'Full article content about AI in rehab...', author: 'Nicolas Khoury', category: 'Technology', tags: JSON.stringify(['AI', 'rehabilitation', 'e-coach']), publishedAt: new Date('2026-03-05') },
      { title: 'LPG Endermologie: What to Expect', slug: 'lpg-endermologie-guide', excerpt: 'Everything you need to know about this non-invasive body shaping treatment.', content: 'Full article content about LPG...', author: 'Nour Sabbagh', category: 'Body Shaping', tags: JSON.stringify(['LPG', 'body shaping', 'aesthetics']), publishedAt: new Date('2026-02-28') },
    ],
  });

  console.log('Blog posts created');

  // ─── FAQ ──────────────────────────────────────────────────
  await prisma.fAQItem.createMany({
    data: [
      { question: 'How do I book my first appointment?', answer: 'Click "Book Now" on our website, select your service, choose a practitioner and time slot, then confirm your booking.', category: 'General', sortOrder: 1 },
      { question: 'What should I bring to my first physiotherapy session?', answer: 'Bring comfortable clothing, any medical reports or scans, your insurance card (if applicable), and a list of current medications.', category: 'Physiotherapy', sortOrder: 2 },
      { question: 'How does the AI E-Coach work?', answer: 'The E-Coach uses AI to guide you through exercises, track your progress, send reminders, and provide real-time feedback between clinic visits.', category: 'E-Coach', sortOrder: 3 },
      { question: 'Can I cancel or reschedule an appointment?', answer: 'Yes, you can cancel or reschedule up to 24 hours before your appointment through your dashboard or by contacting us.', category: 'General', sortOrder: 4 },
      { question: 'What payment methods do you accept?', answer: 'We accept credit cards, cash, and bank transfers. Package payments can be split into installments upon request.', category: 'Payments', sortOrder: 5 },
      { question: 'Is electrolysis permanent?', answer: 'Yes, electrolysis is the only FDA-approved method of permanent hair removal. Multiple sessions are needed to treat all growth cycles.', category: 'Electrolysis', sortOrder: 6 },
    ],
  });

  console.log('FAQ items created');

  // ─── Testimonials ─────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { clientName: 'Ahmad R.', service: 'Physiotherapy', rating: 5, comment: 'Dr. Karim helped me recover from my ACL surgery faster than I expected. The E-Coach follow-up was amazing!' },
      { clientName: 'Nadia K.', service: 'Dietitian', rating: 5, comment: 'Maya created the perfect meal plan for me. Lost 8kg in 3 months while still enjoying my food.' },
      { clientName: 'Georges M.', service: 'LPG Body Shaping', rating: 5, comment: 'After 8 sessions of LPG, I can see visible results. The team is professional and caring.' },
      { clientName: 'Rania S.', service: 'Gym & E-Coach', rating: 5, comment: 'The Gym + E-Coach combo keeps me on track. The AI suggestions are surprisingly helpful!' },
      { clientName: 'Mariam L.', service: 'Electrolysis', rating: 5, comment: 'Finally found a permanent solution. Sara is gentle and thorough. Highly recommend!' },
    ],
  });

  console.log('Testimonials created');

  // ─── Promotions ───────────────────────────────────────────
  await prisma.promotion.createMany({
    data: [
      { name: 'New Client Welcome', code: 'WELCOME20', discountType: 'percentage', discountValue: 20, applicableTo: JSON.stringify(['all']), startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), maxUses: 200, usageCount: 78 },
      { name: 'Referral Bonus', code: 'REFER10', discountType: 'fixed', discountValue: 10, applicableTo: JSON.stringify(['all']), startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), maxUses: 500, usageCount: 34 },
      { name: 'Spring Wellness Special', code: 'SPRING25', discountType: 'percentage', discountValue: 25, applicableTo: JSON.stringify(['all']), startDate: new Date('2026-04-01'), endDate: new Date('2026-04-30'), maxUses: 100, usageCount: 0 },
    ],
  });

  console.log('Promotions created');

  // ─── Staff Service Access ─────────────────────────────────
  await prisma.staffServiceAccess.createMany({
    data: [
      // Therapists can do physio
      { userId: therapist1.id, serviceId: physioService.id },
      { userId: therapist2.id, serviceId: physioService.id },
      // Admin (Nicolas) can do physio too
      { userId: admin.id, serviceId: physioService.id },
      // Dietitian
      { userId: dietitian.id, serviceId: dietService.id },
      // Aesthetician
      { userId: aesthetician.id, serviceId: lpgService.id },
      // Electrologist
      { userId: electrologist.id, serviceId: electroService.id },
      // Trainer can do gym
      { userId: trainer.id, serviceId: gymService.id },
    ],
  });

  console.log('Staff service access created');

  console.log('\nDatabase seeded successfully!');
  console.log('\nDemo accounts:');
  console.log('  Super Admin: superadmin@backinmotion.com / password123');
  console.log('  Admin:       admin@backinmotion.com      / password123');
  console.log('  Client:      demo@backinmotion.com       / demo123');
  console.log('  Client:      rami@example.com            / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
