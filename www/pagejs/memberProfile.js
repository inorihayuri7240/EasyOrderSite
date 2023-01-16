$(document).ready(function () {
    $("#frmList").hide();
    $("#frmAddModify").hide();
    $("#btnModify").attr("disabled", true);
    $("#frmAddModify input[required]").each(function () {
        if ($.trim($(this).val()) == "") {
            $(this).after(
                "<div class=\"invalid-feedback dis-non required\">此欄位為必填</div>"
            );
        }
    });

    //日期區間
    $(".dates").daterangepicker({ //日期區間
        autoUpdateInput: false, //不顯示預設日期
        showDropdowns: true, //月份、年份有下拉選單可選擇
        ranges: { //設定區間選項
            "今天": [moment(), moment()],
            "昨天": [moment().subtract(1, "days"), moment().subtract(1, "days")],
            "過去 7 天": [moment().subtract(6, "days"), moment()],
            "過去 30 天": [moment().subtract(29, "days"), moment()],
            "本月": [moment().startOf("month"), moment().endOf("month")],
            "上個月": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
        },
        locale: { //字串中文化
            applyLabel: "確定",
            cancelLabel: "取消",
            fromLabel: "開始日期",
            toLabel: "結束日期",
            customRangeLabel: "自訂日期區間",
            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月",
                "7月", "8月", "9月", "10月", "11月", "12月"],
            firstDay: 1
        }
    }).on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("YYYY/MM/DD") + " - " + picker.endDate.format("YYYY/MM/DD"));
    });


    //點選查詢按鈕
    $("#btnSearch").click(function () {
        $("#tabAccountList tbody").children().remove();
        Search();
        $("#frmList").show();
    });

    //點選新增按鈕
    $("#btnAdd").click(function () {
        $("#lblAddModify").text("新增資料");
        $("#frmAddModify").show(); //顯示表單
        $("form").not("#frmAddModify").hide(); //此表單外元件隱藏
        $("#frmAddModify :input").val(""); //清空表單
        $("#divModify").hide(); //隱藏修改表單中才會出現的欄位
        $("#frmAddModify *").attr("disabled", false); //啟用表格內元素
    });

    //點選修改按鈕
    $("#btnModify").click(function () {
        $("#lblAddModify").text("修改資料");
        $("form").not("#frmAddModify").hide();
        $("#frmAddModify *").attr("disabled", false); //啟用元素
    });

    //點選刪除按鈕
    $("#btnDelete").click(function () {
        //var checkedTr_ID = [];
        //$("#frmList :checkbox").each(function () {
        //    if ($(this).prop('checked')) {
        //        checkedTr_ID.push($(this).parent().parent().find("th").text());
        //    }
        //});

        //checkedTr_ID.forEach(function (val) {
        //    alert(val);
        //});

        //if ($("#frmList :checkbox").prop('checked')) {
            if (confirm("是否確定刪除")) { //確定傳回true 取消傳回false
                Delete();
                $("#frmList :checked").parent().parent().remove();//刪除被勾選的列
            }
        //}
    });

    //點選確認送出按鈕
    $("#btnSubmit").click(function () {
        if ($("#lblAddModify").text() == "新增資料") Add();
        if ($("#lblAddModify").text() == "修改資料") Modify();
    });

    //點選取消按鈕
    $("#btnCancel").click(function () {
        frmClear();
        $("form").toggle();
    });
});

//點選表格列
function trClick(_thisTr) {
    $("#lblModify").show();
    $("#lblAdd").hide();
    $("#divModify").show();
    $("#btnModify").attr("disabled", false);

    $("#frmAddModify *:not('#btnModify,#btnAdd')").attr("disabled", true); //停用元素
    var tabAccountList = document.getElementById("tabAccountList");
    var id = ($(_thisTr).index()) + 1;
    $("#lblCreatTime2_2").text(tabAccountList.rows[id].cells[15].innerHTML);
    $("#lblId2_2").text(tabAccountList.rows[id].cells[1].innerHTML);
    $("#txtLoginID2").val(tabAccountList.rows[id].cells[2].innerHTML);
    //		$("#txtPassword2").val();
    $("#txtFirstName2").val(tabAccountList.rows[id].cells[5].innerHTML);
    $("#txtLastName2").val(tabAccountList.rows[id].cells[6].innerHTML);
    $("#dplGender2").val(tabAccountList.rows[id].cells[7].innerHTML);
    $("#dgrdBirthday2").val(tabAccountList.rows[id].cells[8].innerHTML.replace(/\//g, '-'));
    $("#txtEmail2").val(tabAccountList.rows[id].cells[9].innerHTML);
    //		$().prop("checked",tabAccountList.rows[id].cells[10].prop("checked"));
    $("#txtPhoneNumber2").val(tabAccountList.rows[id].cells[11].innerHTML);
    $("#txtPostaCode2").val(tabAccountList.rows[id].cells[12].innerHTML);
    $("#txtAddress2").val(tabAccountList.rows[id].cells[13].innerHTML);
    $("#frmAddModify").show();
}

//清空表單
function frmClear() {
    $("#frmAddModify :input").removeClass("is-valid").removeClass("is-invalid");
    $("#frmAddModify :input").val(""); //清空表單
    $("#btnModify").attr("disabled", true); //停用修改按鈕
}

//檢查必填欄位
function CheckRequired() {
    var count = 0; //計算有幾個必填欄位為空
    $("#frmAddModify :input").each(function () { //遍歷所有input對象
        if ($.trim($(this).val()) == "" & typeof ($(this).attr("required")) != "undefined") { //若欄位為空且為必填
            $(this).focus().addClass("is-invalid").next().show();
            count++;
        }
        else if ($.trim($(this).val()) != "") { //若欄位不為空
            $(this).removeClass("is-invalid").addClass("is-valid").next().remove();
        }
    });
    return (count==0);
}

//查詢資料
function Search() {
    let strAPIURL = "../ashx/memberProfile.ashx";
    //let blnExecuteStatus = true; // 執行狀態
    let objData = {
        //strSystemID: "MemberProfilePage",
        strAction: "Search",
        txtID_1: $("#txtID_1").val(),
        txtID_2: $("#txtID_2").val(),
        txtLoginID: $("#txtLoginID").val(),
        dgrdCreatTime: $("#dgrdCreatTime").val(),
        txtLastName: $("#txtLastName").val(),
        txtFirstName: $("#txtFirstName").val(),
        dplGender: $("#dplGender").val(),
        dgrdBirthday: $("#dgrdBirthday").val(),
        txtPhoneNumber: $("#txtPhoneNumber").val(),
        txtPostaCode: $("#txtPostaCode").val(),
        txtAddress: $("#txtAddress").val(),
        txtEmail: $("#txtEmail").val()
    }; // 發送資料
    $.ajax({
        url: strAPIURL, //發送請求的地址
        data: objData, //發送到伺服器的資料
        dataType: "json", //從伺服器返回所期望的資料類型
        method: "POST", //HTTP的請求方法
        cache: false, //不緩存
        success: function (data, textStatus, jqXHR) {
            //if(data[0].ERROR_MESSAGE != "") { // 若有錯誤訊息時
            //	blnExecuteStatus = false; // 執行失敗
            //	alert(data[0].ERROR_MESSAGE);
            //}
            //else if(data[0].MESSAGE != "") { // 若有訊息時
            //                 alert(data[0].MESSAGE);
            //		blnExecuteStatus = false; // 執行失敗
            //}
            //else {
            //blnExecuteStatus = true; // 執行成功
            //for(var i=1;i<=data[0].TOTAL_RECORDS;i++){
            data.forEach(function (D) {
                $("#tabAccountList tbody").append(
                    "<tr onclick=\"trClick(this)\">" +
                    "<td><input type=\"checkbox\"></td>" +
                    "<th>" + D.ID + "</th>" +
                    "<td>" + D.LOGIN_ID + "</td>" +
                    "<td>" + D.ACCOUNT_LEVEL + "</td>" +
                    "<td>" + D.TYPE + "</td>" +
                    "<td>" + D.LAST_NAME + "</td>" +
                    "<td>" + D.FIRST_NAME + "</td>" +
                    "<td>" + D.GENDER + "</td>" +
                    "<td>" + D.BIRTHDAY + "</td>" +
                    "<td>" + D.EMAIL + "</td>" +
                    "<td>" + D.EMAIL_UPDATE + "</td>" +
                    "<td>" + D.PHONENUM + "</td>" +
                    "<td>" + D.POSTA_CODE + "</td>" +
                    "<td>" + D.ADDRESS + "</td>" +
                    "<td>" + D.CREAT_IP + "</td>" +
                    "<td>" + D.CREAT_TIME + "</td>" +
                    "</tr>"
                );
            });
            //}
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
            //blnExecuteStatus = false; // 執行失敗
        }
    });
}

//新增資料
function Add() {
    if (CheckRequired()) { //若無必填欄位為空
        if (confirm("確定要新增這筆資料")) { // 是否確定執行
            let strAPIURL = "../ashx/memberProfile.ashx";
            //let blnExecuteStatus = true; // 執行狀態
            let objData = {
                strSystemID: "MemberProfilePage",
                strAction: "Add",
                lblId2_2: $("#lblId2_2").text(),
                txtLoginID2: $("#txtLoginID2").val(),
                //txtPassword2: $("#txtPassword2").val(),
                txtLastName2: $("#txtLastName2").val(),
                txtFirstName2: $("#txtFirstName2").val(),
                dplGender2: $("#dplGender2").val(),
                dgrdBirthday2: $("#dgrdBirthday2").val(),
                txtEmail2: $("#txtEmail2").val(),
                txtPhoneNumber2: $("#txtPhoneNumber2").val(),
                txtPostaCode2: $("#txtPostaCode2").val(),
                txtAddress2: $("#txtAddress2").val()
            }; // 發送資料
            $.ajax({
                url: strAPIURL,
                data: objData,
                success: function(){
                    frmClear();
                    $("form").not("#frmList").toggle();
                },
                //dataType: "json",
                //method: "POST",
                //cache: false,
                //success: function (data, textStatus, jqXHR) {
                //    if (data[0].ERROR_MESSAGE != "") { // 若有錯誤訊息時
                //        blnExecuteStatus = false; // 執行失敗
                //        alert(data[0].ERROR_MESSAGE);
                //    }
                //    else {

                //    }
                //},
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                    //blnExecuteStatus = false; // 執行失敗
                }
            });

            //alert("新增" + data[0].MESSAGE);
        }
    }
}

//修改資料
function Modify() {
    if (CheckRequired()) { //若無必填欄位為空
        if (confirm("確定要修改這筆資料")) { // 是否確定執行
            let strAPIURL = "../ashx/memberProfile.ashx";
            //let blnExecuteStatus = true; // 執行狀態
            let objData = {
                strSystemID: "MemberProfilePage",
                strAction: "Modify",
                lblId2_2: $("#lblId2_2").text(),
                txtLoginID2: $("#txtLoginID2").val(),
                //txtPassword2: $("#txtPassword2").val(),
                txtLastName2: $("#txtLastName2").val(),
                txtFirstName2: $("#txtFirstName2").val(),
                dplGender2: $("#dplGender2").val(),
                dgrdBirthday2: $("#dgrdBirthday2").val(),
                txtEmail2: $("#txtEmail2").val(),
                txtPhoneNumber2: $("#txtPhoneNumber2").val(),
                txtPostaCode2: $("#txtPostaCode2").val(),
                txtAddress2: $("#txtAddress2").val()
            }; // 發送資料
            $.ajax({
                url: strAPIURL,
                data: objData,
                success: function () {
                    frmClear();
                    $("form").not("#frmList").toggle();
                },
                //dataType: "json",
                //method: "POST",
                //cache: false,
                //success: function (data, textStatus, jqXHR) {
                //    if (data[0].ERROR_MESSAGE != "") { // 若有錯誤訊息時
                //        blnExecuteStatus = false; // 執行失敗
                //        alert(data[0].ERROR_MESSAGE);
                //    }
                //    else {

                //    }
                //},
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                    //blnExecuteStatus = false; // 執行失敗
                }
            });

            //alert("新增" + data[0].MESSAGE);
        }
    }
}

//刪除資料
function Delete() {
    var strCheckedTr_ID = []; //被勾選列
    $("#frmList :checkbox").each(function () {
        if ($(this).prop('checked')) {
            strCheckedTr_ID.push($(this).parent().siblings("th").text());
        }
    });
    //strCheckedTr_ID.forEach(function (val) {
    //    alert(val);
    //});

    let strAPIURL = "../ashx/memberProfile.ashx";
    let objData = {
        strAction: "Delete",
        strCheckedTr_ID: strCheckedTr_ID.join()
    }; // 發送資料
    $.ajax({
        url: strAPIURL,
        data: objData,
        success: function () {
            frmClear();
            $("#frmAddModify").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

