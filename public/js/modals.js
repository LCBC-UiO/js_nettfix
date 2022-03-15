function display_modal(title, body, type, footer=null){
    mod = document.getElementById("modal");
    mod.innerHTML = "";
    mod_diag = document.createElement("div");
    mod_diag.classList = "modal-dialog";
    mod_diag.setAttribute("role", "document");
    mod.appendChild(mod_diag);
    mod_cont = document.createElement("div");
    mod_cont.classList = "modal-content";
    mod_diag.appendChild(mod_cont);
    mod_head = document.createElement("div");
    mod_head.classList = "modal-header";
    mod_cont.appendChild(mod_head);
    mod_h4 = document.createElement("h4");
    mod_h4.classList = `text-${type}`;
    mod_h4.innerHTML = title;
    mod_head.appendChild(mod_h4);
    mod_dismiss = document.createElement("button");
    mod_dismiss.classList = "btn close";
    mod_dismiss.setAttribute("aria-label", "Close");
    mod_dismiss.setAttribute("data-bs-dismiss", "modal");
    mod_dismiss_span = document.createElement("span");
    mod_dismiss_span.innerHTML = "&times;"
    mod_dismiss_span.setAttribute("aria-hidden", "true");
    mod_dismiss.appendChild(mod_dismiss_span);
    mod_head.appendChild(mod_dismiss);
    mod_body = document.createElement("div");
    mod_body.classList = `modal-body alert alert-${type}`;
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

function display_modal_comment(formid, 
    entry = null, 
    header = "Add entry information", 
    alert = "secondary",
    ftext = null
    ){
    e_p = document.createElement("div");
    type = $('.nav-tabs .active').attr("id");
    if(alert == "warning"){
        type = "warning"
    }
    switch(type){
        case "edit-tab":
            e_inputv = create_input("value", "value_input")
            e_p.appendChild(e_inputv);
            ftext = "This will be added to the entry to explain the edit."
            break;
        case "delete-tab":
            ftext = "This will be added to each entry to describe why they have been deleted"
            break;
        case "warning":
            e_p_p = document.createElement("p");
            e_p_p.innerHTML = "You are overriding existing edits. Be careful."
            e_p.appendChild(e_p_p);
            e_inputv = create_input("value", "value_input")
            e_p.appendChild(e_inputv);
            break;
    }
    e_btn = document.createElement("button");
    e_btn.setAttribute("id", "comment_btn");
    e_btn.classList = "btn btn-dark my-2";
    e_btn.innerHTML = "Submit entry";
    let submit = [formid];
    if(entry != null){
        submit = submit.concat(entry);
    }
    cmd_str = `on_comment('${submit.join("?")}')`;
    console.log(cmd_str);
    e_btn.setAttribute("onclick", cmd_str);
    e_input = create_input("comment", "comment_input")
    e_p.appendChild(e_input);
    e_p.appendChild(e_btn);
    display_modal(header, e_p, alert, ftext)
}

function display_modal_205(){
    e_p = document.createElement("p");
    e_p.innerHTML = "This request is not valid.";
    var footer = "Contact Mo with detailed information of what has been done.";
    display_modal("Error", e_p, "danger", footer);
}

function display_modal_override(formid, entry){
    entry = entry.split("??")
    let getentry = `./cgi/get_entry.cgi?=${formid}?${entry[0]}`;
    switch($('.nav-tabs .active').attr("id")){
        case "edit-tab":
            ftitle = "Overriding edit";
            ftext  = `This is the current data entry. What you enter above will replace the value and comment for '${entry[1]}'`;
            break;
       // case "delete-tab":
       //     ftitle = "Overriding deletion";
       //     ftext  = `This is the current data entry. What you enter above will remove all edits and change the comments.`;
       //     break;
    }
    fetch(getentry).then(re => {
        re.json().then(data => {
            ed_div = create_modal_footer(data, ftext);
            display_modal_comment(formid, entry, ftitle, "warning", ed_div);
        })
    })
}

function create_modal_footer(data=null, bottom_div=null){
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
            e_p2.classList = "text text-muted my-2 w-100";
            e_p2.innerHTML = bottom_div;
        }else{
            e_p2 = bottom_div;
        }
        ed_div.appendChild(e_p2);
    }
    return ed_div;
}
