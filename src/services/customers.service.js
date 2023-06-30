import Axios from 'axios';

class CustomerService {
  API_URI = 'http://192.168.100.9:5000/api';

  async getCustomers() {
    try {
      const customers = await Axios.get(`${this.API_URI}/customers`);
      if (customers.status === 200)
        return customers.data;
      return [];
    }
    catch (error) {
      console.error(error.response);
    }

  }

  async getCustomer(id) {
    try {
      const customer = await Axios.get(`${this.API_URI}/customers/${id}`);
      if (customer.status === 200)
        return customer.data;
      return [];
    }
    catch (error) {
      console.log(error);
    }
  }

  async addCustomer(customer) {
    return await Axios.post(`${this.API_URI}/customers`, customer);
  }

  async updateCustomer(id, updatedCustomer) {
    return await Axios.put(`${this.API_URI}/customers/${id}`, updatedCustomer);
  }

  async deleteCustomer(id) {
    return await Axios.delete(`${this.API_URI}/customers/${id}`);
  }

}

const customerService = new CustomerService();
export default customerService;