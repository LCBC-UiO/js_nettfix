function on_comment(entry=null){
    var e_com  = document.getElementById("comment_input").value;
    var e_p    = document.createElement("p");
    var formid = entry.split("?")[0];
    let title  = "Success";
    let type   = "success";
    let ftext  = "Changes should be implemented within 2 hours.";
    let submission_id = null;
    var e_p = document.createElement("p");
    switch($('.nav-tabs .active').attr("id")){
        case "delete-tab":
            var sid = document.querySelectorAll('#submission_id option:checked');
            submission_id = Array.prototype.slice.call(sid,0).map(function(v) { 
                return v.value; 
            });
            let getdel = `./cgi/add_deletions.cgi?=${entry}?${submission_id.join("-")}`;
            fetch(getdel).then(r =>{
                let getcmt = `./cgi/add_comment.cgi?=${entry}?${encodeURI(e_com)}`;
                fetch(getcmt).then(rc =>{
                    e_p.innerHTML = "Entries added for deletion.";
                    if (!rc.ok) {
                        e_p.innerHTML = "An error occured when adding comments to the edits."
                        title = "Error";
                        type  = "danger";
                        ftext = "Contact Mo for debugging."
                    }
                    let getentry = `./cgi/get_entry.cgi?=${formid}?${submission_id}`;
                    fetch(getentry).then(re => {
                        re.json().then(data => {
                            ed_div = create_modal_footer(data, ftext);
                            display_modal(title, e_p, type, ed_div);
                        })
                    })
                })
            })
            submission_id = submission_id.join("?");
            break;
        case "edit-tab":
            entry = entry.split("?")
            entry[3] = encodeURI(document.getElementById("value_input").value);
            let geted = `./cgi/add_entry.cgi?=${entry.join("?")}`;
            fetch(geted).then(r =>{
                let getcmt = `./cgi/add_comment.cgi?=${formid}?${encodeURI(e_com)}`;
                e_p.innerHTML = "Entry added.";
                fetch(getcmt).then(rc =>{
                    if (!rc.ok) {
                        e_p.innerHTML = "An error occured when adding comments to the edits."                
                        title = "Error";
                        type  = "danger";
                        ftext = "Contact Mo for debugging."
                    }
                    let getentry = `./cgi/get_entry.cgi?=${formid}?${submission_id}`;
                    fetch(getentry).then(re => {
                        re.json().then(data => {
                            ed_div = create_modal_footer(data, ftext);
                            display_modal(title, e_p, type, ed_div);
                        })
                    })
                })
            })
            submission_id = entry[1];
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
    let getstr = `./cgi/check_subid.cgi?=${formid}?delete?${submission_id.join("-")}`;
    let getentry = `./cgi/get_entry.cgi?=${formid}?${submission_id}`;
    fetch(getstr).then(r =>{
        switch(r.status){
            case 202:
                r.json().then(function(data){
                    e_p = document.createElement("p");
                    e_p.innerHTML = `Delete entries already exists for submission id(s):<br>${data.submission_id.join(", ")}`;
                    fetch(getentry).then(re => {
                        re.json().then(data => {
                            ed_div = create_modal_footer(data, "If these were done more than two hours ago and still appear in the data, notify Mo");
                            display_modal("No action needed", e_p, "info", ed_div);
                        })
                    })
                })
                break;
            case 203:
                r.json().then(function(data){
                    e_p = document.createElement("p");
                    e_p.innerHTML = `Edit entries already exists for submission id(s):<br>${data.submission_id.join(", ")}`;
                    fetch(getentry).then(re => {
                        re.json().then(data => {
                            ed_div = create_modal_footer(data, "These will need manual inspection, contact Mo");
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
    e_p = document.createElement("p");
    // check if data change can be added
    let getstr = `./cgi/check_subid.cgi?=${formid}?edit?${entry.join("?")}`;
    let submission_id = entry[0];
    fetch(getstr).then(r => {
        let getentry = `./cgi/get_entry.cgi?=${formid}?${submission_id}`;
        fetch(getentry).then(re => {
            switch(r.status){
                case 203:
                    e_p.innerHTML = `submission id '${submission_id}' has an edit entry tagging it for deletion.`;
                    re.json().then(data => {
                        e_div_foot = document.createElement("div");
                        e_div_foot_p = document.createElement("p")
                        e_div_foot_p.innerHTML = "If this is incorrect, you may choose to override it.";
                        e_div_foot_p_small = document.createElement("small");
                        e_div_foot_p_small.innerHTML = "Note that this will permanently erase all previous edits.";
                        e_div_foot_p_small.classList = "text text-muted";
                        e_div_foot.appendChild(e_div_foot_p);
                        e_div_foot_btn = document.createElement("button");
                        e_div_foot_btn.classList = "btn btn-danger";
                        e_div_foot_btn.innerHTML = "Override edits";
                        e_div_foot.appendChild(e_div_foot_btn);
                        ed_div = create_modal_footer(data, e_div_foot);
                        display_modal("Error", e_p, "danger", ed_div);
                    })
                    break;
                case 202:
                    e_p.innerHTML = `An edit entry already exists for submission id ${submission_id} and column '${entry[1]}'`;
                    re.json().then(data => {
                        e_div_foot = document.createElement("div");
                        e_div_foot_p = document.createElement("p")
                        e_div_foot_p.innerHTML = "If this is incorrect, you may choose to override it.";
                        e_div_foot.appendChild(e_div_foot_p);
                        e_div_foot_p_small = document.createElement("small");
                        e_div_foot_p_small.innerHTML = "Note that this will permanently erase all previous edits.";
                        e_div_foot_p_small.classList = "text text-muted";
                        e_div_foot.appendChild(e_div_foot_p_small);
                        e_div_foot_btn = document.createElement("button");
                        e_div_foot_btn.classList = "btn btn-danger";
                        e_div_foot_btn.innerHTML = "Override edits";
                        let cmd = `display_modal_override(${formid}, '${entry.join("??")}')`;
                        e_div_foot_btn.setAttribute("onclick", cmd);
                        e_div_foot.appendChild(e_div_foot_btn);
                        ed_div = create_modal_footer(data, e_div_foot);
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
            on_tsv_input(formid, entry) 
            break;
    }
    display_modal_comment(formid, entry);
}
