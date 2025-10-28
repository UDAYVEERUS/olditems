// import { NextResponse } from 'next/server';
// import { db } from '@/db';
// import { users } from '@/db/schema';
// import { getCurrentUser } from '@/lib/auth';
// import { eq } from 'drizzle-orm';

// export async function GET() {
//   try {
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Get user from database
//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, currentUser.userId))
//       .limit(1);

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if subscription is active and not expired
//     const now = new Date();
//     const hasActiveSubscription = 
//       user.subscriptionStatus === 'ACTIVE' && 
//       user.subscriptionEndDate && 
//       new Date(user.subscriptionEndDate) > now;

//     return NextResponse.json({
//       canList: hasActiveSubscription, // Can only list if subscribed
//       hasActiveSubscription,
//       subscriptionStatus: user.subscriptionStatus,
//       subscriptionEndDate: user.subscriptionEndDate,
//       needsPayment: !hasActiveSubscription, // Must pay if no active subscription
//       message: hasActiveSubscription 
//         ? 'Active subscription - List unlimited products' 
//         : 'Subscribe for ₹10/month to start listing products',
//     });
//   } catch (error) {
//     console.error('Check subscription error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }