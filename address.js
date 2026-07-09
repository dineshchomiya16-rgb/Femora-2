// Delivery Address module
// Stores the customer's delivery address in the browser's localStorage only.
// No backend, database, or server is used — data stays on this device.

const ADDRESS_STORAGE_KEY = 'femora_delivery_address';

// Holds the product selected via "Buy Now" while the address step is completed.
let pendingProduct = null;

function getSavedAddress(){
  try{
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    return null;
  }
}

function fillAddressForm(address){
  if(!address) return;
  document.getElementById('addrName').value = address.name || '';
  document.getElementById('addrMobile').value = address.mobile || '';
  document.getElementById('addrPin').value = address.pin || '';
  document.getElementById('addrState').value = address.state || '';
  document.getElementById('addrCity').value = address.city || '';
  document.getElementById('addrFull').value = address.address || '';
  document.getElementById('addrLandmark').value = address.landmark || '';
}

function clearAddressErrors(){
  document.querySelectorAll('#addressOverlay .field-error').forEach(el => el.textContent = '');
}

function setFieldError(fieldId, message){
  const el = document.getElementById('err-' + fieldId);
  if(el) el.textContent = message;
}

function validateAddressForm(){
  clearAddressErrors();
  let valid = true;

  const name = document.getElementById('addrName').value.trim();
  const mobile = document.getElementById('addrMobile').value.trim();
  const pin = document.getElementById('addrPin').value.trim();
  const state = document.getElementById('addrState').value.trim();
  const city = document.getElementById('addrCity').value.trim();
  const address = document.getElementById('addrFull').value.trim();

  if(!name){ setFieldError('addrName', 'Full name zaroori hai'); valid = false; }
  if(!/^[6-9]\d{9}$/.test(mobile)){ setFieldError('addrMobile', 'Valid 10-digit mobile number daalein'); valid = false; }
  if(!/^\d{6}$/.test(pin)){ setFieldError('addrPin', 'Valid 6-digit PIN code daalein'); valid = false; }
  if(!state){ setFieldError('addrState', 'State zaroori hai'); valid = false; }
  if(!city){ setFieldError('addrCity', 'City zaroori hai'); valid = false; }
  if(!address){ setFieldError('addrFull', 'Address zaroori hai'); valid = false; }

  return valid;
}

function openAddressModal(){
  fillAddressForm(getSavedAddress());
  clearAddressErrors();
  document.getElementById('addressOverlay').classList.add('show');
}

function saveAddressAndContinue(){
  if(!validateAddressForm()) return;

  const address = {
    name: document.getElementById('addrName').value.trim(),
    mobile: document.getElementById('addrMobile').value.trim(),
    pin: document.getElementById('addrPin').value.trim(),
    state: document.getElementById('addrState').value.trim(),
    city: document.getElementById('addrCity').value.trim(),
    address: document.getElementById('addrFull').value.trim(),
    landmark: document.getElementById('addrLandmark').value.trim()
  };

  try{
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
  }catch(e){
    // localStorage not available (private browsing etc.) — continue without blocking checkout
  }

  closeModal('addressOverlay');
  proceedToPayment();
}
