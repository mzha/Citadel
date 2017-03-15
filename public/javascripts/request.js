function validateForm()
    {
    var file = document.forms["request"]["filename"].value;
    if (file == null || file == "")
      {
      alert("Please fill out empty fields");
      return false;
      }
    }
