const { getIndiaPincode } = require("india-pincode");

const pin = getIndiaPincode();
// All the same methods work:
const address = pin.getByPincode('422009');
console.log(address.data.data);
// pin.getByState('MAHARASHTRA');
// pin.search('Koramangala');
// pin.findNearby(28.6353, 77.225, 5);