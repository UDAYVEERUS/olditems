// import { NextResponse } from 'next/server';
// import { db } from '@/db';
// import { users, products } from '@/db/schema';
// import { getCurrentUser } from '@/lib/auth';
// import { refundPayment } from '@/lib/cashfree';
// import { eq } from 'drizzle-orm';

// export async function POST() {
//   try {
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Get user
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

//     if (!user.subscriptionId) {
//       return NextResponse.json(
//         { error: 'No active subscription found' },
//         { status: 400 }
//       );
//     }

//     // Refund the subscription fee
//     await refundPayment(
//       user.subscriptionId,
//       10,
//       'User cancelled subscription'
//     );

//     // Update user status
//     await db
//       .update(users)
//       .set({
//         subscriptionStatus: 'CANCELLED',
//       })
//       .where(eq(users.id, user.id));

//     // Hide all user's products
//     await db
//       .update(products)
//       .set({ status: 'HIDDEN' })
//       .where(eq(products.userId, user.id));

//     return NextResponse.json({
//       success: true,
//       message: 'Subscription cancelled successfully. Your products have been hidden.',
//     });
//   } catch (error) {
//     console.error('Cancel subscription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to cancel subscription' },
//       { status: 500 }
//     );
//   }
// }