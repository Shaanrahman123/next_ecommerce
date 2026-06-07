export const AUTH_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_LENGTH: 'Password must be at least 6 characters',
  NAME_REQUIRED: 'First name and last name are required',
  EMAIL_EXISTS: 'An account with this email already exists',
  SIGNUP_SUCCESS: 'Account created successfully',
  SOCIAL_SIGNUP_SUCCESS: 'Social registration successful',
  SOCIAL_LOGIN_SUCCESS: 'Account signed up and logged in successfully',
  INVALID_SOCIAL_TYPE: 'Invalid social login type',
  SOCIAL_ID_REQUIRED: 'Social ID is required for social login',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SOCIAL_LOGIN_REQUIRED: (provider: string) => `Please log in using your registered ${provider} account, or set a password first.`,
  LOGIN_SUCCESS: 'Login successful',
  FORGOT_PASSWORD_CONFIRM: 'If the email is registered, a verification code has been sent',
  OTP_SENT: 'Verification code sent to your email',
  RESEND_OTP_SUCCESS: 'A new verification code has been sent to your email',
  INVALID_OTP: 'Invalid or expired verification code',
  EXPIRED_OTP: 'Verification code has expired. Please request a new one.',
  OTP_VERIFIED: 'Verification code verified successfully',
  FIELDS_REQUIRED: 'All fields (email, verification token, and new password) are required',
  RESET_SUCCESS: 'Password has been reset successfully',
  NO_REFRESH_TOKEN: 'No refresh token provided',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  USER_NOT_FOUND: 'User not found',
  LOGOUT_SUCCESS: 'Logged out successfully',
  ACCESS_DENIED: 'Access denied. Administrator privileges required.',
  EMAIL_NOT_FOUND: 'No account found with this email address',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
  ADDRESS_ADDED: 'Address added successfully',
  ADDRESS_UPDATED: 'Address updated successfully',
  ADDRESS_DELETED: 'Address deleted successfully',
  ADDRESS_NOT_FOUND: 'Address not found',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
};

export const ADMIN_AUTH_MESSAGES = {
  ...AUTH_MESSAGES,
  LOGIN_SUCCESS: 'Admin login successful',
  LOGOUT_SUCCESS: 'Admin logged out successfully',
  ACCESS_DENIED: 'Access denied. Admin account required.',
  EMAIL_NOT_FOUND: 'No admin account found with this email address',
  INVALID_CREDENTIALS: 'Invalid admin credentials',
  NOT_ADMIN: 'This account does not have admin privileges',
};

export const SUPERCATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_EXISTS: 'Super Category with this name already exists',
  SLUG_EXISTS: 'Super Category with this slug already exists',
  CREATE_SUCCESS: 'Super Category created successfully',
  NOT_FOUND: 'Super Category not found',
  FETCH_SUCCESS: 'Super Category fetched successfully',
  UPDATE_SUCCESS: 'Super Category updated successfully',
  DELETE_SUCCESS: 'Super Category deleted successfully',
  DUPLICATE_NAME: 'Another Super Category with this name already exists',
  DUPLICATE_SLUG: 'Another Super Category with this slug already exists',
};

export const CATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_EXISTS: 'Category with this name already exists',
  SLUG_EXISTS: 'Category with this slug already exists',
  CREATE_SUCCESS: 'Category created successfully',
  NOT_FOUND: 'Category not found',
  FETCH_SUCCESS: 'Category fetched successfully',
  UPDATE_SUCCESS: 'Category updated successfully',
  DELETE_SUCCESS: 'Category deleted successfully',
  DUPLICATE_NAME: 'Another Category with this name already exists',
  DUPLICATE_SLUG: 'Another Category with this slug already exists',
  SUPER_CATEGORY_REQUIRED: 'At least one Super Category is required in the superCategories array',
  SUPER_CATEGORY_NOT_FOUND: 'One or more referenced Super Categories do not exist or are inactive',
};


export const GLOBAL_MESSAGES = {
  DB_CONNECTION_FAILED: 'Database connection failed',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  INVALID_LOGIN_TYPE: 'Invalid login type',
  INVALID_REGISTRATION_TYPE: 'Invalid registration type',
};

export const SUBCATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_EXISTS: 'Sub Category with this name already exists',
  SLUG_EXISTS: 'Sub Category with this slug already exists in this category',
  CREATE_SUCCESS: 'Sub Category created successfully',
  NOT_FOUND: 'Sub Category not found',
  FETCH_SUCCESS: 'Sub Category fetched successfully',
  UPDATE_SUCCESS: 'Sub Category updated successfully',
  DELETE_SUCCESS: 'Sub Category deleted successfully',
  DUPLICATE_NAME: 'Another Sub Category with this name already exists',
  DUPLICATE_SLUG: 'Another Sub Category with this slug already exists',
  CATEGORY_REQUIRED: 'Parent category is required',
  CATEGORY_NOT_FOUND: 'Referenced category does not exist',
};

export const PRODUCT_MESSAGES = {
  NAME_REQUIRED: 'Product name is required',
  PRICE_REQUIRED: 'Product price is required',
  HERO_IMAGE_REQUIRED: 'Product hero image is required',
  SUPER_CATEGORIES_REQUIRED: 'At least one Super Category is required',
  CATEGORIES_REQUIRED: 'At least one Category is required',
  CREATE_SUCCESS: 'Product created successfully',
  NOT_FOUND: 'Product not found',
  FETCH_SUCCESS: 'Product fetched successfully',
  UPDATE_SUCCESS: 'Product updated successfully',
  DELETE_SUCCESS: 'Product deleted successfully',
  DUPLICATE_NAME: 'Another product with this name already exists',
  DUPLICATE_SLUG: 'Another product with this slug already exists',
  SUPER_CATEGORIES_INVALID: 'One or more referenced Super Categories do not exist',
  CATEGORIES_INVALID: 'One or more referenced Categories do not exist',
  SUBCATEGORIES_INVALID: 'One or more referenced Sub Categories do not exist',
};


