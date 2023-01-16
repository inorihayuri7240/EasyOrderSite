function loginSystem(_frmForm) {
	if ($.trim($("#txtLoginID").val()) == "") { //若密碼為空
		$("#txtLoginID").addClass("is-invalid").next().show();
	} else {
		$("#txtLoginID").removeClass("is-invalid").addClass("is-valid").next().hide();
	}
	if ($.trim($("#txtLoginPWD").val()) == "") { //若密碼為空
		$("#txtLoginPWD").addClass("is-invalid").next().show();
	} else {
		$("#txtLoginPWD").removeClass("is-invalid").addClass("is-valid").next().hide();
	}

	if ($.trim($("#txtLoginID").val()) != "" && $.trim($("#txtLoginPWD").val()) != "") {
		let strAPIURL = "../ashx/index.ashx";
		let objdata = { // 發送資料
			//strSystemID : "LoginPage",
			//strAction : "Login",
			txtLoginID : $("#txtLoginID").val(),
			txtLoginPWD: $("#txtLoginPWD").val()
		};
		let strURL = "../memberProfile.html";
		$.ajax({
			url: strAPIURL,
			data: objdata,
			datatype: "text",
			method: "POST",
			cache: false,
			success: function (data, textStatus, jqXHR) {
				alert(data=="True" ? "登入成功" : "帳號或密碼輸入錯誤");
				if (data == "True")
					top.location.href = strURL; // 引導頁
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
    }
	
}