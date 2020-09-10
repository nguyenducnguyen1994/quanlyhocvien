const API = "https://ql-hoc-vien.herokuapp.com/users";
let searchData = '';
let _currentPage = 1;
let _sortQ = 'id';
let order = 'desc';
let userLimitPerPage = 10;

// LẤY DỮ LIỆU VỀ ĐỔ RA TABLE
$(function () {
    // Gọi lên API để lấy danh sách user
    $.ajax({
        url: `${API}?_page=${_currentPage}&&_order=${order}&&_sort=${_sortQ}`,
        method: "GET",
    }).done(function (users, textStatus, xhr) {
        // Gọi hàm loadTableUser để đổ dữ liệu ra bảng
        loadTableUser(users);
        renderPageBtn(xhr.getResponseHeader('X-Total-Count'));
    });
});
// lấy dữ liệu ra bảng
function loadTableUser(user) {
    for (let i = 0; i < user.length; i++) {
        $("#table-users").append(`<tr id="row-${user[i].id}">
    <td>${user[i].name || "chưa biết"}</td>
    <td>${user[i].birthday || "chưa biết"}</td>
    <td>${user[i].email || "chưa biết"}</td>
    <td>${user[i].phone || "chưa biết"}</td>
    <td class="d-flex justify-content-between align-items-center">
    <button class="btn btn-info" data-toggle="modal" data-target="#form-edit" onclick="renderInfoUser(${user[i].id})"><i class="far fa-edit"></i> Chỉnh sửa</button><span> | </span>
            <button button class="btn btn-danger" onclick = "deleteUser(${user[i].id})" > <i class="far fa-trash-alt"> Xóa</i></button>
    </td >
</tr > `);
    }
}

// TẠO MỚI USER
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

// XÓA USER 
function deleteApi(id) {
    $.ajax({
        method: 'DELETE',
        url: `${API}/${id}`,
    })
        .done(function () {
            // Ản modam xóa
            $("#modal-delete").modal("hide");
            // Xóa dòng
            $(`#row-${id}`).remove();
        })
}

function deleteUser(id) {
    // Hiện modal xóa
    $("#modal-delete").modal("show");
    // Lấy button có id confirm-delete khi ấn gọi hàm deleteApi
    $('#confirm-delete').click(function () {
        deleteApi(id);
    });
}

function renderInfoUser(id) {
    $.ajax({
        method: "GET",
        url: `${API}/${id}`,
    }).done(function (item) {
        if (renderContentEdit) {
            renderContentEdit(item);
        }
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
        `<button button class="btn btn-info" onclick = "editInfoUserApi(${item.id})" ><i class="far fa-save"></i> Lưu</button>`
    $("#btn-update-user").html(btnUpdate);
}

// Lấy thông tin đã chỉnh sửa lưu lại vào bảng
function editInfoUserApi(id) {
    $.ajax({
        method: "PUT",
        url: `${API}/${id}`,
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



// Page
function renderPageBtn(usersCount) {
    let pageCount = Math.ceil(usersCount / userLimitPerPage);
    for (let i = 1; i <= pageCount; i++) {
        $('#page-indicator').append(`<button class="btn btn-secondary m-2" onclick="changePage(this)">${i}</button>`);
    }
}

function renderPage() {
    $.ajax({
        type: 'GET',
        url: `${API}?_page=${_currentPage}&&_order=${order}&&_sort=${_sortQ}&&q=${searchData}`,
        success: function (users) {
            loadTableUser(users);
        }
    });
}

function changePage(ele) {
    _currentPage = $(ele).text();
    $('tbody').html('');
    // $('.loader').show();
    $('#page-indicator button').removeClass('active');
    ele.classList.add('active');
    $.ajax({
        type: 'GET',
        url: `${API}?_page=${_currentPage}&&_order=${order}&&_sort=${_sortQ}&&q=${searchData}`,
        success: function (users) {
            loadTableUser(users);
        }
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