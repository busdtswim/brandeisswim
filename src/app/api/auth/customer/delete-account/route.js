import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { deleteCustomerAccount } from '../../../../../lib/handlers/customer/deleteAccount';

export async function DELETE(request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized - Customer access required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Call the handler to delete the account
    const result = await deleteCustomerAccount(userId);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account', details: error.message }, 
      { status: 500 }
    );
  }
} 