
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
    mod_h4.classList = "text-" + type;
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

function display_modal_comment(formid, entry=null, header = "Add entry information", alert = "secondary"){
    e_p = document.createElement("div");
    e_input = create_input("comment", "comment_input")
    if($('.nav-tabs .active').attr("id") == "edit-tab"){
        e_inputv = create_input("value", "value_input")
        e_p.appendChild(e_inputv);
    }
    e_btn = document.createElement("button");
    e_btn.setAttribute("id", "comment_btn");
    e_btn.classList = "btn btn-secondary primary my-2";
    e_btn.innerHTML = "Submit entry";
    if(entry != null){
        cmt_str = "on_comment('" + formid + "?" + entry.join("?") + "')";
    }else{
        cmt_str = "on_comment('" + formid + "')";
    }
    e_btn.setAttribute("onclick", cmt_str);
    e_p.appendChild(e_input);
    e_p.appendChild(e_btn);
    var footer = "This will be added to each entry to describe why they have been edited";      
    display_modal(header, e_p, alert, footer)
}

function display_modal_205(){
    e_p = document.createElement("p");
    e_p.innerHTML = "This request is not valid.";
    var footer = "Contact Mo with detailed information of what has been done.";
    display_modal("Error", e_p, "danger", footer);
}

function display_modal_override(formid, entry){
    entry = entry.split("??")
    console.log(formid + " " + entry);
    switch($('.nav-tabs .active').attr("id")){
        case "edit-tab":
            display_modal_comment(formid, entry, "Overriding entry", "warning");
            break;
        case "delete-tab":
            display_modal_comment(formid, entry, "Overriding deletion", "warning");
            break;
    }
}