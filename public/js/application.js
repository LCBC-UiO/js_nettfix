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
            e_thead.classList = "thead-primary bg-primary text-white";
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
            e_input.type = "text";
            e_input.value = f;
            if(divid == "deltsv"){
                e_input.disabled = true;
            }
            e_input.classList = "cell-input form-control";
            if(row_idx == 0){
                e_input.classList.add("border-0")
                e_td.classList = "border border-dark border-2  table-th ";
            }
            e_td.appendChild(e_input);
            if(row_idx == 0){
                e_input.disabled = true; //dont allow input on header
            }else{
                // on input, data is updated
                e_input.oninput = (evt) => on_input(evt, table, row_idx, col_idx);
            }
        }
    });
}

async function trigger_table(){
    table = await get_tsv();
    await display_table(table, "tsv");
    await display_table(table, "deltsv", 5); // display only five first columns when deleting entries
    await get_submissions(table);
}

////////////////////////////////////
//       CREATE DOM ELEMENTS      //
function create_footer(data=null, bottom_div=null){
    var ed_div = document.createElement("div");
    ed_div.classList = "alert alert-secondary";
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
    if( data != null && bottom_div != null){
        e_hr = document.createElement("hr");
        e_hr.classList = "border-2 border-top border-dark w-100";
        ed_div.appendChild(e_hr);
    }
    if(bottom_div != null){
        if (typeof bottom_div === 'string'){
            e_p2 = document.createElement("p");
            e_p2.classList = "my-2 w-100";
            e_p2.innerHTML = bottom_div;
        }else{
            e_p2 = bottom_div;
        }
        ed_div.appendChild(e_p2);
    }
    return ed_div;
}

function create_input(char, name){
    i_div = document.createElement("div");
    i_div.classList = "input-group mb-3";
    i_input = document.createElement("input");
    i_input.id = name;
    i_input.classList = "form-control";
    i_input.setAttribute("aria-label", name);
    i_input.setAttribute("aria-describedby", name);
    i_input.setAttribute("type", "text");
    i_input.setAttribute("size", "50"); 
    i_div.appendChild(i_input)
    i_pre = document.createElement("div");
    i_pre.classList = "input-group-append";
    i_div.appendChild(i_pre);
    i_span = document.createElement("span");
    i_span.classList = "input-group-text"
    i_span.id = char;
    i_span.innerHTML = char
    i_pre.appendChild(i_span);
    return i_div;
}


////////////////////////////////////
//         JQUERY MAGIC           //
    
// autofocus on modal input text
$('#modal').on('shown.bs.modal', function () {
    $('#comment_input').focus()
    $('#value_input').focus()
})

// click comment save button on enter
// does not work
$('#comment_input').keyup(function(event) {
    if (event.keyCode == 13) {
        $('#comment_btn').click();
    }
});

////////////////////////////////////////
// Start the whole thing, grab forms! //
get_forms();
