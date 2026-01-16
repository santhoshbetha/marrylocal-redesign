import supabase from '../lib/supabase';

// Admin invite codes - in production, these should be stored securely
const ADMIN_INVITE_CODES = [
  'ADMIN4355',
  'SUPERUSER4355',
  'MARRYLOCALADMIN4355'
];

export const registerAdmin = async (userData) => {
  try {
    // Validate invite code
    if (!ADMIN_INVITE_CODES.includes(userData.inviteCode.toUpperCase())) {
      return {
        success: false,
        message: 'Invalid invite code. Please contact support for a valid admin invite code.'
      };
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email, phonenumber')
      .or(`email.eq.${userData.email},phonenumber.eq.${userData.phonenumber}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      return {
        success: false,
        message: 'Error checking existing user.'
      };
    }

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email or phone number already exists.'
      };
    }

    // Calculate age
    const birthDate = new Date(userData.dateofbirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password, // Use provided password
      options: {
        data: {
          firstname: userData.firstname,
          lastname: userData.lastname,
          role: 'admin'
        }
      }
    });

    if (authError) {
      return {
        success: false,
        message: authError.message
      };
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        userid: authData.user.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phonenumber: userData.phonenumber,
        dateofbirth: userData.dateofbirth,
        gender: userData.gender,
        age: age,
        role: 'admin',
        userstate: 'inactive', // Admin needs to verify email first
        emailverified: false,
        termsaccepted: true, // Assume admin accepts terms
        created_at: new Date().toISOString()
      });

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        message: 'Failed to create admin profile. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Admin registration successful. Please check your email for verification link.',
      user: authData.user
    };

  } catch {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    };
  }
};