class TagAssignClass {
    constructor() {
        this.assignedId = [];
    }

    init() {
        this.initForm();
        this.initAutocomplete();
    }

    /******************************** autocomplete when assign tags */

    initAutocomplete() {
        autocomplete(document.getElementById("tag-assign"), TagAssign);
    }

    getList() {
        let autocompleteList = [];
        // get list of unasigned tags
        Tag.getTagList().forEach((tag) => {
            if (!this.assignedId.includes(tag.id)) {
                autocompleteList.push(tag.name);
            }
        });
        return autocompleteList;
    }

    getAssignedId() {
        return this.assignedId
    }

    /****************************************** create tag */

    initForm() {
        $("#tag-assign-form").submit((event) => {
            event.preventDefault();
            let inputTagName = $("#tag-assign-form #tag-assign").val();

            this.isAssigned(
                inputTagName,
                (tagListElement) => {
                    this.create(
                        tagListElement.id,
                        tagListElement.name,
                        tagListElement.color
                    );
                },
                () => {
                    $("#tag-assign-form #tag-assign").val("");
                }
            );
        });
    }

    isAssigned(input, callBackYes, callBackNo) {
        Tag.getTagList().forEach((tagListElement) => {
            if (
                tagListElement.name == input &&
                !this.assignedId.includes(tagListElement.id)
            ) {
                callBackYes(tagListElement);
            }
            if (
                tagListElement.name == input ||
                this.assignedId.includes(tagListElement.id)
            ) {
                callBackNo();
            }
        });
    }

    assignId(assign, tagId) {
        let id = parseInt(tagId)
        if (assign && !this.assignedId.includes(id)) {
            this.assignedId.push(id);
        } else {
            this.assignedId.splice(this.assignedId.indexOf(id), 1);
        }
    }

    cleanAssignedId() {
        this.assignedId = [];
    }

    /****************************************** preview tags */

    displayAllPreviewTag(tags) {
        this.cleanPreviewTag();
        tags.forEach((tag) => {
            this.displayPreviewTag(tag);
        });
    }

    displayPreviewTag(tag) {
        this.assignId(true, tag.tagId);
        $("#tag-assigned-list").append(this.generatePreviewTag(tag));
        $(`#chip-${tag.tagId} button`).click(() => {
            this.remove(tag);
        });
    }

    generatePreviewTag(tag) {
        return `<div class="chip" id="chip-${tag.tagId}" tagid="${tag.tagId}" style="background:${tag.color}; color:${niceColor(tag.color)};">
                    <span>${tag.name}</span>
                    <button class="icon-close"></button>
                </div>`;
    }

    updatePreviewTag(tag) {
        $(`#chip-${tag.tagId}`).css("background", tag.color);
        $(`#chip-${tag.tagId} span`).html(tag.name);
    }

    removePreviewTag(tagId) {
        this.assignId(false, tagId);
        $(`#chip-${tagId}`).remove().unbind();
    }

    cleanPreviewTag() {
        this.cleanAssignedId();
        $("#tag-assigned-list").empty();
        $("#tag-assign").val('')
    }

    /********************************* contact tags */

    displayAllContactListTag(tags) {
        tags.forEach((tag) => {
            this.displayContactListTag(tag);
        });
    }

    displayContactListTag(tag) {
        $(`#contact-${tag.contactId} .mini-tag-block`)
            .show()
            .append(
                `<div class="mini-chip" id="mini-chip-${tag.tagId}" style="background:${tag.color}">${tag.name}</div>`
            );
    }

    updateAllContactListTag(tag) {
        $(`[id=mini-chip-${tag.tagId}]`)
            .css("background", tag.color)
            .html(tag.name);
    }

    removeContactListTag(tagId) {
        $(`#contact-${Contact.getCurrentId()} #mini-chip-${tagId}`).remove();
    }

    removeAllContactListTag(tagId) {
        $(`[id=mini-chip-${tagId}]`).remove();
        if ($(`#contact-${tag.contactId} .mini-tag-block`).is(':empty')) {
            $(`#contact-${tag.contactId} .mini-tag-block`).hide()
        }
    }

    /****************************************** */

    create(tagId, name, color) {
        ajaxRequest(
            "/tagassign",
            "POST",
            JSON.stringify({ contactId: Contact.getCurrentId(), tagId }),
            (tag) => {
                // give name
                tag.name = name;
                tag.color = color;
                this.displayPreviewTag(tag);
                this.displayContactListTag(tag);
                this.updateTagCount(tag.tagId, 1);
            },
            (status) => {
                if (status == 400) {
                    toast(t(AppName, "This tag already exist."), 3);
                } else {
                    toast(t(AppName, "An error occurred."), 3);
                }
            }
        );
    }

    remove(tag) {
        ajaxRequest("/tagassign/" + tag.id, "DELETE", null, () => {
            this.removePreviewTag(tag.tagId);
            this.removeContactListTag(tag.tagId);
            this.updateTagCount(tag.tagId, -1);
        });
    }

    /*********************************************** */

    updateTagCount(tagId, n) {
        Tag.updateTagCount(tagId, n);
    }
}

var TagAssign = new TagAssignClass();