const API = "https://ql-hoc-vien.herokuapp.com/users";


// lấy dữ liệu đổ vào bảng.
$(function () {
    $.ajax({
        url: API,
        method: "GET",
    })
        .done(function (dataUsers) {
            htmlString = "";
            for (let i = 0; i < dataUsers.length; i++) {
                htmlString += `<tr>
                        <td>${dataUsers[i].name}</td>
                        <td>${dataUsers[i].birthday}</td>
                        <td>${dataUsers[i].email}</td>
                        <td>${dataUsers[i].phone}</td>
                        <td class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-info" data-toggle="modal" data-target="#form-edit"  onclick="renderInfoUser(${dataUsers[i].id})"><i class="far fa-edit"> Chỉnh sửa</i></button><span>|</span>
                            <button class="btn btn-danger" data-toggle="modal" data-target="#modal-delete"><i class="far fa-trash-alt" onclick="renderInfoUser(${dataUsers[i].id})"> Xóa</i></button>
                        </td>
                </tr>`;
            }
            $('#list-users').html(htmlString);
        });
});





// Tạo mới user
function createUserAPI(user) {
    $.ajax({
        method: 'POST',
        url: API,
        data: user
    }).done(function () {
        // load lại trang
        location.reload();
    })
}
// Lấy dữ liệu ô input
function createUser() {
    const user = {
        name: $('#name').val(),
        birthday: $('#year').val(),
        email: $('#email').val(),
        phone: $('#phone').val()
    }
    // Gọi hàm tạo mới user api
    createUserAPI(user);
}


// gửi request lên server lấy id
function renderInfoUser(id) {
    $.ajax({
        method: "GET",
        url: API + "/" + id,
    }).done(function (item) {
        if (renderContentEdit) {
            renderContentEdit(item);
        }
        if (renderContentDelete) {
            renderContentDelete(item);
        }
    });
}



// Xóa thông tin user
function renderContentDelete(item) {
    // Tạo nút xóa và gán sự kiện xóa (truyền vào id của user)
    let btnDelete = "";
    btnDelete += `<button type="button" onclick="deleteUserApi(${item.id})" class="btn btn-danger"><i class="far fa-trash-alt"></i> Xóa</button>`;
    $(".btn-delete").html(btnDelete);
}

function deleteUserApi(id) {
    $.ajax({
        method: "DELETE",
        url: API + "/" + id,
        dataType: "json",
    }).done(function () {
        // Load lại table
        location.reload();
        // Tắt modal
        $("#modal-delete").modal("hide");
    });
}




// Chỉnh sửa user
function renderContentEdit(item) {
    // Lấy thông tin user cần update
    $("#editName").val(item.name);
    $("#editBirthday").val(item.birthday);
    $("#editEmail").val(item.email);
    $("#editPhone").val(item.phone);

    // Render button lưu và ván sự kiện
    let btnUpdate = "";
    btnUpdate +=
        ' <button type="button" onclick="editInfoUserApi(' +
        item.id +
        ')"  class="btn btn-primary"><i class="far fa-save"></i> Lưu</button>';
    $(".btn-update-user").html(btnUpdate);
}


// Lấy thông tin đã chỉnh sửa lưu lại vào bảng
function editInfoUserApi(id) {
    $.ajax({
        method: "PUT",
        url: API + "/" + id,
        contentType: "application/json",
        data: JSON.stringify({
            name: $("#editName").val(),
            birthday: $("#editBirthday").val(),
            email: $("#editEmail").val(),
            phone: $("#editPhone").val(),
        }),
    }).done(function () {
        // Load lại table
        location.reload();
        // Ẩn modal update
        $("#form-edit").modal("hide");
    });
}



































// sắp xếp
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}