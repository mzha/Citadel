function checkLogin()
    {
    var username = document.forms["login"]["username"].value;
    var password = document.forms["login"]["password"].value;
    if (username == null || username == "" || password == null || password == "")
      {
      alert("Please fill out empty fields");
      return false;
      }
    }
