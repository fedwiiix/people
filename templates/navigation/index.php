<div class="app-navigation-new">
    <button type="button" class="icon-add" id="create-contact">
        Add contact
    </button>
</div>
<ul>
    <li>
        <a href="#" class="icon-toggle-filelist">All contacts
            <div class="app-navigation-entry-utils">
                <ul>
                    <li class="app-navigation-entry-utils-menu-button" id="create-tag-bp">
                        <button></button>
                    </li>
                </ul>
            </div>
        </a>
        <div class="app-navigation-entry-menu" id="create-tag">
            <ul>
                <li>
                    <a href="#">
                        <form id="tag-create-form">
                            <input id="input-create-tag" type="text" placeholder="New tag">
                            <input type="submit" value=" " class="icon-confirm">
                        </form>
                    </a>
                </li>
            </ul>
        </div>
    </li>
    <li>
        <a href="#" class="icon-favorite">Favorites tags</a>
        <ul id="tag-favorite"></ul>
    </li>
    <li>
        <a href="#" class="icon-tag">tags</a>
        <ul id="tag-list"></ul>
    </li>
</ul>