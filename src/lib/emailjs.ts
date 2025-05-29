import emailjs from '@emailjs/browser';

// Initialize with public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendEmail = async (templateId: string, data: any) => {
  try {
    // Format the message content
    let messageContent = '';

    // Add service type header
    messageContent += `Service Type: ${data.service_type}\n\n`;

    // Shipper Information
    messageContent += 'Shipper Information:\n';
    messageContent += `- Name: ${data.shipper_info.name}\n`;
    messageContent += `- Email: ${data.shipper_info.email}\n`;
    messageContent += `- Phone: ${data.shipper_info.phone}\n\n`;

    // Shipline Information (for Ocean Freight)
    if (data.shipline_info) {
      messageContent += 'Shipline Information:\n';
      messageContent += `- Loading Port: ${data.shipline_info.loading_port}\n`;
      messageContent += `- Discharge Port: ${data.shipline_info.discharge_port}\n`;
      messageContent += `- Carrier: ${data.shipline_info.carrier}\n\n`;
    }

    // Receiver Information (for Ocean Freight)
    if (data.receiver_info) {
      messageContent += 'Receiver Information:\n';
      messageContent += `- Consignee Name: ${data.receiver_info.consignee_name}\n`;
      messageContent += `- Consignee Address: ${data.receiver_info.consignee_address}\n`;
      messageContent += `- Consignee Phone: ${data.receiver_info.consignee_phone}\n`;
      if (data.receiver_info.notify_party) {
        messageContent += `- Notify Party: ${data.receiver_info.notify_party}\n`;
      }
      messageContent += '\n';
    }

    // Pickup Information (for Inland/Dispatch)
    if (data.pickup_info) {
      messageContent += 'Pickup Information:\n';
      messageContent += `- Location Type: ${data.pickup_info.location_type}\n`;
      messageContent += `- Address: ${data.pickup_info.address}\n`;
      messageContent += `- Contact Name: ${data.pickup_info.contact_name}\n`;
      messageContent += `- Contact Phone: ${data.pickup_info.contact_phone}\n\n`;
    }

    // Delivery Information (for Inland/Dispatch)
    if (data.delivery_info) {
      messageContent += 'Delivery Information:\n';
      messageContent += `- Location Type: ${data.delivery_info.location_type}\n`;
      messageContent += `- Address: ${data.delivery_info.address}\n\n`;
    }

    // Vehicle Information
    if (data.vehicle_info) {
      messageContent += 'Vehicle Information:\n';
      messageContent += `- Year: ${data.vehicle_info.year}\n`;
      messageContent += `- Make: ${data.vehicle_info.make}\n`;
      messageContent += `- Model: ${data.vehicle_info.model}\n`;
      messageContent += `- VIN: ${data.vehicle_info.vin}\n`;
      if (data.vehicle_info.category) {
        messageContent += `- Category: ${data.vehicle_info.category}\n`;
      }
      if (data.vehicle_info.title_number) {
        messageContent += `- Title Number: ${data.vehicle_info.title_number}\n`;
      }
      if (data.vehicle_info.title_state) {
        messageContent += `- Title State: ${data.vehicle_info.title_state}\n`;
      }
      if (data.vehicle_info.declared_value) {
        messageContent += `- Declared Value: $${data.vehicle_info.declared_value}\n`;
      }
      if (data.vehicle_info.condition) {
        messageContent += `- Condition: ${data.vehicle_info.condition}\n`;
      }
      messageContent += '\n';
    }

    // Additional Information
    if (data.additional_info) {
      messageContent += 'Additional Information:\n';
      if (data.additional_info.lot_number) {
        messageContent += `- Lot Number: ${data.additional_info.lot_number}\n`;
      }
      messageContent += `- Is Runner: ${data.additional_info.is_runner ? 'Yes' : 'No'}\n`;
      messageContent += `- Car/Title Ready: ${data.additional_info.car_title_ready ? 'Yes' : 'No'}\n`;
    }

    const emailData = {
      to_name: 'Admin',
      from_name: data.shipper_info.name,
      from_email: data.shipper_info.email,
      message: messageContent,
      subject: `Quote Request - ${data.service_type}`
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId,
      emailData
    );

    return response;
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};

// Function to send confirmation email to customer
export const sendCustomerConfirmationEmail = async (templateId: string, data: any) => {
  try {
    // Format the message content for customer
    let messageContent = '';
    
    // Add thank you message
    messageContent += `Dear ${data.shipper_info.name},\n\n`;
    messageContent += `Thank you for requesting a quote for our ${data.service_type} service. We have received your request and our team will review it shortly.\n\n`;
    messageContent += `Here's a summary of the information you provided:\n\n`;
    
    // Add service type header
    messageContent += `Service Type: ${data.service_type}\n\n`;
    
    // Shipper Information
    messageContent += 'Your Information:\n';
    messageContent += `- Name: ${data.shipper_info.name}\n`;
    messageContent += `- Email: ${data.shipper_info.email}\n`;
    messageContent += `- Phone: ${data.shipper_info.phone}\n\n`;
    
    // Shipline Information (for Ocean Freight)
    if (data.shipline_info) {
      messageContent += 'Shipline Information:\n';
      messageContent += `- Loading Port: ${data.shipline_info.loading_port}\n`;
      messageContent += `- Discharge Port: ${data.shipline_info.discharge_port}\n`;
      messageContent += `- Carrier: ${data.shipline_info.carrier}\n\n`;
    }
    
    // Vehicle Information
    if (data.vehicle_info) {
      messageContent += 'Vehicle Information:\n';
      messageContent += `- Year: ${data.vehicle_info.year}\n`;
      messageContent += `- Make: ${data.vehicle_info.make}\n`;
      messageContent += `- Model: ${data.vehicle_info.model}\n`;
      messageContent += `- VIN: ${data.vehicle_info.vin}\n\n`;
    }
    
    // Closing message
    messageContent += 'Our team will contact you shortly with a quote. If you have any questions, please feel free to contact us.\n\n';
    messageContent += 'Thank you for choosing JayKash Logistics.\n\n';
    messageContent += 'Best regards,\nJayKash Logistics Team';
    
    const emailData = {
      to_name: data.shipper_info.name,
      to_email: data.shipper_info.email,
      from_name: 'JayKash Logistics',
      message: messageContent,
      subject: `Your Quote Request - ${data.service_type}`
    };
    
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId,
      emailData
    );
    
    return response;
  } catch (error) {
    console.error('EmailJS customer confirmation error:', error);
    throw error;
  }
};