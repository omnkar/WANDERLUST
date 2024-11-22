(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  const titleField=document.getElementById('title');
  const priceField=document.getElementById("price");
  const countryField=document.getElementById('country')
  const locField=document.getElementById('loc')
  titleField.addEventListener('keypress',(event)=>
    {
      if(event.key>='0' && event.key<='9')
      {
        event.preventDefault();
      }
    })
  countryField.addEventListener('keypress',(event)=>
    {
      if(event.key>='0' && event.key<='9')
      {
        event.preventDefault();
      }
    })
  locField.addEventListener('keypress',(event)=>
    {
      if(event.key>='0' && event.key<='9')
      {
        event.preventDefault();
      }
    })
  priceField.addEventListener('keypress',(event)=>
    {
      if((event.key>='a' && event.key<='z') ||(event.key>='A' && event.key<='Z') || event.key.length()>5)
      {
        event.preventDefault();
      }
    })