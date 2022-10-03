import { ADMIN, USER } from "../utils/constants";

Accounts.onCreateUser((options, user) => {
  if (options.email === 'admin@admin.com') {
    user.profile = options.profile ? option.profile : {};
    user.profile.role = ADMIN;
  } else {
    user.profile = options.profile ? option.profile : {};
    user.profile.role = USER;
  }

  return user
})