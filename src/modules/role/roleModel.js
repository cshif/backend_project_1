import roles from '../../constants/roles.js';

class Role {
  constructor({ roleId }) {
    this.roleId = roleId;
  }

  get role() {
    switch (this.roleId) {
      case 1:
        return roles.ADMIN;
      case 2:
        return roles.CUSTOMER_SERVICE;
      case 3:
        return roles.SALES;
      default:
        return roles.CUSTOMER;
    }
  }
}

export default Role;
