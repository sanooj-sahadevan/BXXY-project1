$("#formValidation").validate({
    rules: {
      Name: {
        required: true,
        minlength: 3,
      },
      Email: {
        required: true,
        email: true,
      },
      Password: {
        required: true,
        minlength: 6,
        maxlength: 15,
      },
      Number: {
        number: true,
        minlength: 10,
        maxlength: 10,
      },
    },
    messages: {
      Name: {
        required: "Please enter  name",
        minlength: "Requires minimum of 3 characters",
      },
  
      Email: {
        required: "Please enter the email",
        email: "Enter a valid email",
      },
  
      Password: {
        required: "Please enter a password",
        minlength: "Required 6 digits",
        maxlength: "Cannot be more than 10 digits",
      },
  
      Number: {
        required: "Please enter the mobile number",
        minlength: "Required 10 digits",
        maxlength: "Cannot be more than 10 digits",
      },
    },
  
    submitHandler: function (form) {
      form.submit();
    },
  });