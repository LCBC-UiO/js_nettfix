////////////////////////////////////
// GETTING DATA FROM SYSTEM FILES //
    async function get_forms() {
    const r_forms = await fetch("./cgi/get_form_id.cgi");
    r_forms_j = await r_forms.json();
    let e_forms = document.getElementById("form_id");
    let e_forms_li = document.createElement("option");
    e_forms.appendChild(e_forms_li);
    // generate selection list of forms
    r_forms_j.forms.forEach(
        function(f_id){
        if(f_id == "NULL") return; // dont display NULL
        let e_forms_li = document.createElement("option");
        e_forms_li.innerHTML = `${f_id}`;
        e_forms.appendChild(e_forms_li);
        }
    )
};

async function get_tsv(){
    var formid = document.getElementById("form_id").value;
    var getstr = "./cgi/get_form_csv.cgi?=" + formid;
    const r = await fetch(getstr);
    if (!r.ok) {
        console.log("error ok");
    }
    const tsv_str = await r.text();
    const table = tsv_str.split("\n").map(l => l.split("\t"));
    return table;
}

async function get_submissions(table){
    if(table === undefined) return; // return if no form selected, quiets initial console errors
    let e_forms = document.getElementById("submission_id");
    e_forms.innerHTML = ""; // empty list
    table.forEach((r,row_idx) => {
        if(row_idx == 0) return;
        let e_forms_li = document.createElement("option");
        e_forms_li.innerHTML = `${r[0]}`;
        e_forms.appendChild(e_forms_li);
        });
};

////////////////////////////////////
//   CHANGE WEBSITE INFORMATION   //
async function display_table(table, divid, ncol = null){
    const e_table = document.getElementById(divid);
    e_table.innerHTML = ""; // remove previous table from div
    // if ncol is null or more columns than table has, take all columns
    if(ncol == null || ncol > table[0].length) ncol = table[0].length;
    table.forEach((r,row_idx) => {
        const e_tr = document.createElement("tr");
        if(row_idx == 0){ // make table header
            const e_thead = document.createElement("thead");
            e_thead.classList.add("thead-primary");
            e_thead.classList.add("bg-primary");
            e_thead.classList.add("text-white");
            e_thead.appendChild(e_tr);
            e_table.appendChild(e_thead);
            var e_type = "th";
        }else{
            e_table.appendChild(e_tr);
            var e_type = "td";
        }
        for (let col_idx = 0; col_idx < ncol; col_idx++) {
            let f = r[col_idx]
            const e_td = document.createElement(e_type);
            e_tr.appendChild(e_td);
            const e_input = document.createElement("input");
            e_td.appendChild(e_input);
            e_input.type = "text";
            e_input.value = f;
            if(row_idx == 0){
                e_input.disabled = true; //dont allow input on header
            }else{
                // on input, data is updated
                e_input.oninput = (evt) => on_input(evt, table, row_idx, col_idx);
            }
        }
    });
}

function display_modal(title, body, type, footer=null){
    mod = document.getElementById("modal");
    mod.innerHTML = "";
    mod_diag = document.createElement("div");
    mod_diag.classList = "modal-dialog";
    mod.appendChild(mod_diag);
    mod_cont = document.createElement("div");
    mod_cont.classList = "modal-content";
    mod_diag.appendChild(mod_cont);
    mod_head = document.createElement("div");
    mod_head.classList = "modal-header";
    mod_cont.appendChild(mod_head);
    mod_h4 = document.createElement("h4");
    mod_h4.classList = "text-" + type;
    mod_h4.innerHTML = title;
    mod_head.appendChild(mod_h4);
    mod_body = document.createElement("div");
    mod_body.classList = "modal-body alert alert-" + type;
    mod_body.appendChild(body);
    mod_cont.appendChild(mod_body);
    if(footer != null){
        if(typeof footer == "string"){
        mod_foot = document.createElement("div");
        mod_foot_sm = document.createElement("small");
        mod_foot_sm.innerHTML = footer;
        mod_foot_sm.classList = "text-muted text-align-right";
        mod_foot.appendChild(mod_foot_sm);
        }else{
        mod_foot = footer;
        }
        mod_foot.classList.add("modal-footer");
        mod_cont.appendChild(mod_foot);
    }
    $('#modal').modal('show');
}

function display_modal_comment(formid, entry=null){
    e_p = document.createElement("div");
    e_input = document.createElement("input");
    e_input.setAttribute("id", "comment_input");
    e_input.setAttribute("size", "50");
    document.querySelector('input').autofocus = true;
    e_btn = document.createElement("button");
    e_btn.setAttribute("id", "comment_btn");
    e_btn.classList = "btn btn-primary my-2";
    e_btn.innerHTML = "Submit comment";
    if(entry != null){
        cmt_str = "on_comment('" + formid + "?" + entry.join("?") + "')";
    }else{
        cmt_str = "on_comment('" + formid + "')";
    }
    e_btn.setAttribute("onclick", cmt_str);
    e_p.appendChild(e_input);
    e_p.appendChild(e_btn);
    var footer = "This will be added to each entry to describe why they have been edited";      
    display_modal("Add comment", e_p, "secondary", footer)
}

function display_modal_205(){
    e_p = document.createElement("p");
    e_p.innerHTML = "This request is not valid.";
    var footer = "Contact Mo with detailed information of what has been done.";
    display_modal("Error", e_p, "danger", footer);
}

async function trigger_table(){
    table = await get_tsv();
    await display_table(table, "tsv");
    await display_table(table, "deltsv", 5); // display only five first columns when deleting entries
    await get_submissions(table);
}

function create_footer(data=null, text=null){
    var ed_div = document.createElement("div");
    ed_div.classList = "alert alert-secondary";
    if(text != null){
        e_p2 = document.createElement("p");
        e_p2.classList = "my-2 w-100";
        e_p2.innerHTML = text;
        ed_div.appendChild(e_p2);
    }
    if( data != null && text != null){
        e_hr = document.createElement("hr");
        e_hr.classList = "border-2 border-top border-dark w-100";
        ed_div.appendChild(e_hr);
    }
    if(data != null){
        e_pre = document.createElement("pre");
        e_pre.classList = "w-100 border border-white border-2";
        e_pre_h4 = document.createElement("h4");
        e_pre_h4.innerHTML = "Entry json";
        e_pre_h4.classList = "my-2 w-100 text-muted";
        e_code = document.createElement("code");
        e_code.classList = "language-json text-muted";
        e_code.innerHTML = JSON.stringify(data, null, 2);
        ed_div.appendChild(e_pre_h4);
        e_pre.appendChild(e_code);
        ed_div.appendChild(e_pre);
    }
    return ed_div;
}
    
////////////////////////////////////
//     ON USER EDIT REQUESTS      //
function on_comment(entry=null){
    var e_com  = document.getElementById("comment_input").value;
    var e_p    = document.createElement("p");
    var formid = entry.split("?")[0];
    let title  = "Success";
    let type   = "success";
    let ftext  = null;
    let submission_id = null;
    var e_p = document.createElement("p");
    switch($('.nav-tabs .active').attr("id")){
        case "delete-tab":
        var sid = document.querySelectorAll('#submission_id option:checked');
        submission_id = Array.prototype.slice.call(sid,0).map(function(v) { 
            return v.value; 
        });
        let getdel = "./cgi/add_deletions.cgi?=" + entry + "?" +  submission_id.join("-");
        fetch(getdel).then(r =>{
            let getcmt = "./cgi/add_comment.cgi?=" + entry + "?" + encodeURI(e_com);
            fetch(getcmt).then(rc =>{
                e_p.innerHTML = "Entries added for deletion.";
                if (!rc.ok) {
                    e_p.innerHTML = "An error occured when adding comments to the edits."
                    title = "Error";
                    type  = "danger";
                    ftext = "Contact Mo for debugging."
                }
                let getentry = "./cgi/get_entry.cgi?=" + formid + "?" + submission_id;
                fetch(getentry).then(re => {
                    re.json().then(data => {
                        console.log(data)
                        ed_div = create_footer(data, ftext);
                        display_modal(title, e_p, type, ed_div);
                    })
                })
            })
        })
        submission_id = submission_id.join("?");
        break;
        case "edit-tab":
        let geted = "./cgi/add_entry.cgi?=" + entry ;
        fetch(geted).then(r =>{
            let getcmt = "./cgi/add_comment.cgi?=" + formid + "?" + encodeURI(e_com);
            e_p.innerHTML = "Entry added.";
            fetch(getcmt).then(rc =>{
                if (!rc.ok) {
                    e_p.innerHTML = "An error occured when adding comments to the edits."                
                    title = "Error";
                    type  = "danger";
                    ftext = "Contact Mo for debugging."
                }
                let getentry = "./cgi/get_entry.cgi?=" + formid + "?" + submission_id;
                fetch(getentry).then(re => {
                    re.json().then(data => {
                        console.log(data)
                        ed_div = create_footer(data, ftext);
                        display_modal(title, e_p, type, ed_div);
                    })
                })
            })
        })
        submission_id = entry.split("?")[1];
        break;
    }
}

function on_delete_input(formid){
    // get subid array
    var sid = document.querySelectorAll('#submission_id option:checked');
    var submission_id = Array.prototype.slice.call(sid,0).map(function(v) { 
        return v.value; 
    });
    // check is subids can be deleted
    let getstr = "./cgi/check_subid.cgi?=" + formid + "?delete?" + submission_id.join("-");
    fetch(getstr).then(r =>{
        switch(r.status){
        case 203:
            r.json().then(function(data){
            e_p = document.createElement("p");
            e_p.innerHTML = "Edit entries already exists for submission id(s):<br>" + data.submission_id.join(", ");
            let getentry = "./cgi/get_entry.cgi?=" + formid + "?" + submission_id;
            fetch(getentry).then(re => {
                re.json().then(data => {
                    ed_div = create_footer(data, "These will need manual inspection, contact Mo");
                    display_modal("Error", e_p, "danger", ed_div);
                })
            })
            })
            break;
        case 205:
            display_modal_205();
            break;
        }
    })
};

function on_tsv_input(formid, entry) {
    document.getElementById("savebtn").disabled = false;
    e_p = document.createElement("p");
    // check if data change can be added
    let getstr = "./cgi/check_subid.cgi?=" + formid + "?edit?" + entry.join("?");
    let submission_id = entry[0];
    fetch(getstr).then(r => {
        let getentry = "./cgi/get_entry.cgi?=" + formid + "?" + submission_id;
        fetch(getentry).then(re => {
            switch(r.status){
                case 203:
                    e_p.innerHTML = "submission id " + submission_id + " has an edit entry tagging it for deletion.";
                    re.json().then(data => {
                        ed_div = create_footer(data, "If this is incorrect it will need manual inspection, contact Mo");
                        display_modal("Error", e_p, "danger", ed_div);
                    })
                    break;
                case 202:
                    e_p.innerHTML = "Edit entries already exists for submission id " + submission_id + " and column '" + entry[1] + "'";
                    re.json().then(data => {
                        ed_div = create_footer(data, "If this is incorrect it will need manual inspection, contact Mo");
                        display_modal("Error", e_p, "danger", ed_div);
                    })
                    break;
                case 205:
                    display_modal_205();
                    break;
                }
        })
    })
}

function on_input(evt = null, table = null, row_idx = null, col_idx = null){
    var formid = document.getElementById("form_id").value;
    active_tab = $('.nav-tabs .active').attr("id");
    switch(active_tab){
        case "delete-tab":
            on_delete_input(formid);
            var entry = null;
            break;
        case "edit-tab":
            // assign variable names
            var entry = [table[row_idx][0], table[0][col_idx], evt.target.value]
            on_tsv_input(formid, entry) ;
            break;
    }
    display_modal_comment(formid, entry);
}
    
//autofocus on modal input text
$('#modal').on('shown.bs.modal', function () {
    $('#comment_input').focus()
})

// click comment save button on enter
$("#comment_input").keyup(function(event) {
    if (event.keyCode == 13) {
        $("#comment_btn").click();
    }
});

// Start the whole thing, grab forms!
get_forms();
