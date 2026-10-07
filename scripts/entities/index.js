module.exports = {
  Truck: {
    name: 'Truck', table: 'trucks', icon: 'bi-truck', label: 'Truck',
    fields: [
      { name: 'vehicle_number', type: 'STRING', label: 'Vehicle Number', required: true, unique: true, list: true },
      { name: 'vehicle_type', type: 'ENUM', values: ['truck','trailer','container','tempo'], label: 'Type', default: 'truck', list: true },
      { name: 'capacity_kg', type: 'DECIMAL', label: 'Capacity (KG)', required: true, list: true },
      { name: 'insurance_policy_number', type: 'STRING', label: 'Insurance Policy' },
      { name: 'insurance_expiry', type: 'DATE', label: 'Insurance Expiry', list: true },
      { name: 'gps_device_id', type: 'STRING', label: 'GPS Device ID' },
      { name: 'gps_active', type: 'BOOLEAN', label: 'GPS Active', default: false },
      { name: 'current_location', type: 'STRING', label: 'Current Location' },
      { name: 'owner_id', type: 'INTEGER', label: 'Owner ID' },
      { name: 'status', type: 'ENUM', values: ['available','on_trip','inactive'], label: 'Status', default: 'available', list: true }
    ]
  },

  Driver: {
    name: 'Driver', table: 'drivers', icon: 'bi-person-badge', label: 'Driver',
    fields: [
      { name: 'name', type: 'STRING', label: 'Name', required: true, list: true },
      { name: 'phone', type: 'STRING', label: 'Phone', required: true, list: true },
      { name: 'license_number', type: 'STRING', label: 'License No.', required: true, unique: true, list: true },
      { name: 'license_expiry', type: 'DATE', label: 'License Expiry', list: true },
      { name: 'experience_years', type: 'INTEGER', label: 'Experience (Years)', default: 0 },
      { name: 'status', type: 'ENUM', values: ['available','on_trip','inactive'], label: 'Status', default: 'available', list: true }
    ]
  },

  Load: {
    name: 'Load', table: 'loads', icon: 'bi-box-seam', label: 'Load',
    fields: [
      { name: 'load_number', type: 'STRING', label: 'Load No.', required: true, unique: true, list: true },
      { name: 'commodity', type: 'STRING', label: 'Commodity', required: true, list: true },
      { name: 'origin', type: 'STRING', label: 'Origin', required: true, list: true },
      { name: 'destination', type: 'STRING', label: 'Destination', required: true, list: true },
      { name: 'weight_kg', type: 'DECIMAL', label: 'Weight (KG)', required: true, list: true },
      { name: 'pickup_from', type: 'DATE', label: 'Pickup From', required: true },
      { name: 'offered_price', type: 'DECIMAL', label: 'Offered Price', list: true },
      { name: 'status', type: 'ENUM', values: ['posted','matched','booked','delivered'], label: 'Status', default: 'posted', list: true }
    ]
  },

  Shipment: {
    name: 'Shipment', table: 'shipments', icon: 'bi-box', label: 'Shipment',
    fields: [
      { name: 'shipment_number', type: 'STRING', label: 'Shipment No.', required: true, unique: true, list: true },
      { name: 'pickup_location', type: 'STRING', label: 'Pickup', required: true, list: true },
      { name: 'delivery_location', type: 'STRING', label: 'Delivery', required: true, list: true },
      { name: 'freight_amount', type: 'DECIMAL', label: 'Freight', list: true },
      { name: 'status', type: 'ENUM', values: ['pending','assigned','in_transit','delivered'], label: 'Status', default: 'pending', list: true }
    ]
  },

  Trip: {
    name: 'Trip', table: 'trips', icon: 'bi-geo-alt', label: 'Trip',
    fields: [
      { name: 'trip_number', type: 'STRING', label: 'Trip No.', required: true, unique: true, list: true },
      { name: 'start_date', type: 'DATE', label: 'Start Date', list: true },
      { name: 'start_location', type: 'STRING', label: 'Start Location', list: true },
      { name: 'end_location', type: 'STRING', label: 'End Location', list: true },
      { name: 'status', type: 'ENUM', values: ['planned','started','completed'], label: 'Status', default: 'planned', list: true }
    ]
  },

  Expense: {
    name: 'Expense', table: 'expenses', icon: 'bi-cash-stack', label: 'Expense',
    fields: [
      { name: 'expense_type', type: 'ENUM', values: ['diesel','toll','driver_allowance','food','maintenance','other'], label: 'Type', required: true, list: true },
      { name: 'amount', type: 'DECIMAL', label: 'Amount', required: true, list: true },
      { name: 'expense_date', type: 'DATE', label: 'Date', required: true, list: true }
    ]
  },

  Payment: {
    name: 'Payment', table: 'payments', icon: 'bi-credit-card', label: 'Payment',
    fields: [
      { name: 'payment_number', type: 'STRING', label: 'Payment No.', required: true, unique: true, list: true },
      { name: 'amount', type: 'DECIMAL', label: 'Amount', required: true, list: true },
      { name: 'payment_date', type: 'DATE', label: 'Date', list: true },
      { name: 'payment_method', type: 'ENUM', values: ['cash','bank','upi','cheque'], label: 'Method', default: 'bank', list: true },
      { name: 'status', type: 'ENUM', values: ['pending','paid'], label: 'Status', default: 'pending', list: true }
    ]
  },

  InsurancePolicy: {
    name: 'InsurancePolicy', table: 'insurance_policies', icon: 'bi-shield-check', label: 'Insurance',
    fields: [
      { name: 'policy_number', type: 'STRING', label: 'Policy No.', required: true, unique: true, list: true },
      { name: 'policy_type', type: 'ENUM', values: ['vehicle','cargo','driver'], label: 'Type', required: true, list: true },
      { name: 'provider_name', type: 'STRING', label: 'Provider', required: true, list: true },
      { name: 'coverage_amount', type: 'DECIMAL', label: 'Coverage', list: true },
      { name: 'end_date', type: 'DATE', label: 'End Date', list: true },
      { name: 'status', type: 'ENUM', values: ['active','expired'], label: 'Status', default: 'active', list: true }
    ]
  },

  Warehouse: {
    name: 'Warehouse', table: 'warehouses', icon: 'bi-building', label: 'Warehouse',
    fields: [
      { name: 'name', type: 'STRING', label: 'Name', required: true, list: true },
      { name: 'code', type: 'STRING', label: 'Code', list: true },
      { name: 'city', type: 'STRING', label: 'City', list: true },
      { name: 'contact_phone', type: 'STRING', label: 'Phone' },
      { name: 'status', type: 'ENUM', values: ['active','inactive'], label: 'Status', default: 'active', list: true }
    ]
  },

  MasterLoad: {
    name: 'MasterLoad', table: 'master_loads', icon: 'bi-boxes', label: 'Master Load',
    fields: [
      { name: 'master_load_number', type: 'STRING', label: 'Master No.', required: true, unique: true, list: true },
      { name: 'container_number', type: 'STRING', label: 'Container', list: true },
      { name: 'total_weight_kg', type: 'DECIMAL', label: 'Weight (KG)', list: true },
      { name: 'origin', type: 'STRING', label: 'Origin', list: true },
      { name: 'destination', type: 'STRING', label: 'Destination', list: true },
      { name: 'status', type: 'ENUM', values: ['in_transit','arrived','split','dispatched'], label: 'Status', default: 'in_transit', list: true }
    ]
  }
};
