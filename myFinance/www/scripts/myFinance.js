$(document).ready(function () {
    addStandardCategories();
    setOverviewPage();

});

$('#btnSaveTransaction').click(function () {
    saveTransaction();
});

$('#btnSaveAccount').click(function () {
    saveAccount();
});

$('.btn-overview').click(function () {
    console.log("Changed to Overview");
    setOverviewPage();
});

$('.btn-home').click(function () {
    console.log("Changed to Home");
    setHomePage();
});

$('.btn-history').click(function () {
    console.log("Changed to History");
    setHistoryPage();
});

/**
 * Adds Standard-Categories to the LocalStorage
 */
function addStandardCategories() {
    var categories = {
        'categories': [
            { 'id': 0, 'desc': 'Drinks & Food' },
            { 'id': 1, 'desc': 'Rent' },
            { 'id': 2, 'desc': 'IT' }
        ]
    };
    localStorage.setItem('categories', JSON.stringify(categories));
}

function setOverviewPage() {
    if (keyIsInLocalStorage('accounts', 'accountOverview')) {
        // Parse JSON of Accounts
        var obj = JSON.parse(localStorage.getItem('accounts'));
        var accounts = obj.accounts;
        console.log(accounts);
        $('.account').remove();
        $('.option-account').remove();
        // Add HTML-Element for each Account
        for (i = 0; i < accounts.length; i++) {
            console.log(accounts[i]);
            appendAccountOverview(accounts[i], 'accountOverview');
            setAccountSelect(accounts[i], 'account-select-overview');
        }
        setCategorySelect('category-select-overview');
    }
}

function keyIsInLocalStorage(key, page) {
    if (localStorage.getItem(key) == null) {
        $('#' + page).css('display', 'none');
        $('.new-transaction').css('display', 'none');
        return false;
    } else {
        $('.accounts-none').css('display', 'none');
        $('#' + page).css('display', 'block');
        $('.new-transaction').css('display', 'block');
        return true;
    }
}

function appendAccountOverview(account, page) {
    console.log('Appending ' + account);
    $('#' + page).append(
        $('<div></div>')
            .addClass('jumbotron ui-shadow account')
            .append(
            $('<div></div>')
                .addClass('ui-grid-a')
                .append(
                $('<div></div>')
                    .addClass('ui-block-a')
                    .text('Account')
                )
                .append(
                $('<div></div>')
                    .addClass('ui-block-b account-name')
                    .text(account.name)
                )
            )
            .append($('<hr />'))
            .append(
            $('<div></div>')
                .addClass('ui-grid-a')
                .append(
                $('<div></div>')
                    .addClass('ui-block-a')
                    .text('Balance')
                )
                .append(
                $('<div></div>')
                    .addClass('ui-block-b account-balance')
                    .attr('id', 'accountBalance' + account.id)
                    .text(account.balance + ' CHF')
                )
            )
    );
}

function setAccountSelect(account, page) {
    $('#' + page).append(
        $('<option></option>')
            .attr('value', account.id)
            .addClass('option-account')
            .text(account.name)
    );
}

function setCategorySelect(page) {
    var cat = JSON.parse(localStorage.getItem('categories'));
    var categories = cat.categories;

    $('.option-category').remove();

    for (c = 0; c < categories.length; c++) {

        var category = categories[c];

        $('#category-select-overview').append(
            $('<option></option>')
                .attr('value', category.id)
                .addClass('option-category')
                .text(category.desc)
        );
    }
}

function saveTransaction() {
    var accountId = $("#account-select-overview option:selected").val();
    var desc = $('#descInput').val();
    var categoryId = $("#category-select-overview option:selected").val();
    var value = $('#valueInput').val();

    if (localStorage.getItem('transactions') == null) {
        var transactions = {
            'transactions': [
                {
                    'id': 0, 'accountId': accountId, 'desc': desc, 'categoryId': categoryId, 'value': value
                }
            ]
        };
        localStorage.setItem('transactions', JSON.stringify(transactions));

    } else {
        var obj = JSON.parse(localStorage.getItem('transactions'));
        var transactions = obj.transactions;
        var t = transactions.length;
        var newTransaction = {
            'id': t, 'accountId': accountId, 'desc': desc, 'categoryId': categoryId, 'value': value
        };

        obj.transactions[t] = newTransaction;
        localStorage.setItem('transactions', JSON.stringify(obj));
    }

    console.log(localStorage.getItem('transactions'));
    recalculateBalances();
}


function recalculateBalances() {
    var obj = JSON.parse(localStorage.getItem('accounts'));
    var accounts = obj.accounts;

    var obj2 = JSON.parse(localStorage.getItem('transactions'));
    var transactions = obj2.transactions;

    for (t = 0; t < transactions.length; t++) {

        var tAccount = transactions[t].accountId - 1;
        var tValue = transactions[t].value;

        obj.accounts[tAccount].balance -= tValue;
        console.log('New Balance:' + accounts[tAccount].balance);
        $('#accountBalance' + transactions[t].accountId).text(accounts[tAccount].balance + ' CHF');
    }

    localStorage.setItem('accounts', JSON.stringify(obj));
}

function setHistoryPage() {
    var storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts == null) {
        $('#accountHistorySelect').css('display', 'none');
        $('.new-transaction').css('display', 'none');
    } else {
        $('.accounts-none').css('display', 'none');

        // Parse JSON of Accounts
        var obj = JSON.parse(storedAccounts);
        var accounts = obj.accounts;
        $('.option-account').remove();

        // Add HTML-Element for each Account
        for (i = 0; i < accounts.length; i++) {
            setAccountSelect(accounts[i], 'account-select-history');
        }

        $('#account-select-history').change(function () {

            $('.account').remove();
            $('.transaction').remove();
            $('.transaction-title').remove();

            var jsonCategories = JSON.parse(localStorage.getItem('categories'));
            var categories = jsonCategories.categories;

            var accountId = $("#account-select-history option:selected").val();

            if (localStorage.getItem('transactions') != null) {

                var json = JSON.parse(localStorage.getItem('accounts'));
                var account = json.accounts[accountId - 1];

                $('#transactionOverview').append(
                    $('<div></div>')
                        .addClass('jumbotron ui-shadow account')
                        .append(
                        $('<div></div>')
                            .addClass('ui-grid-a')
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-a')
                                .text('Account')
                            )
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-b account-name')
                                .text(account.name)
                            )
                        )
                        .append($('<hr />'))
                        .append(
                        $('<div></div>')
                            .addClass('ui-grid-a')
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-a')
                                .text('Balance')
                            )
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-b account-balance')
                                .attr('id', 'accountBalance' + account.id)
                                .text(account.balance + ' CHF')
                            )
                        )
                );

                $('#transactionOverview').append(
                    $('<h4></h4')
                        .addClass('transaction-title')
                        .text('Transactions')
                );

                $('#transactionOverview').append(
                    $('<div></div>')
                        .addClass('jumbotron ui-shadow transaction')
                        .append(
                        $('<div></div>')
                            .addClass('ui-grid-c')
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-a transaction-details')
                                .text('ID')
                            )
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-b transaction-details')
                                .text('Category')
                            )
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-c transaction-details')
                                .text('Description')
                            )
                            .append(
                            $('<div></div>')
                                .addClass('ui-block-d transaction-details')
                                .text('Value in CHF')
                            )
                        )
                        .append($('<hr />'))
                );

                var obj = JSON.parse(localStorage.getItem('transactions'));
                for (i = 0; i < obj.transactions.length; i++) {

                    var transaction = obj.transactions[i];
                    var cat = transaction.categoryId;

                    if (transaction.accountId == accountId) {

                        $('#transactionOverview').append(
                            $('<div></div>')
                                .addClass('jumbotron ui-shadow transaction')
                                .append(
                                $('<div></div>')
                                    .addClass('ui-grid-c')
                                    .append(
                                    $('<div></div>')
                                        .addClass('ui-block-a transaction-details')
                                        .attr('id', 't' + transaction.id)
                                        .text(transaction.id)
                                    )
                                    .append(
                                    $('<div></div>')
                                        .addClass('ui-block-b transaction-details')
                                        .attr('id', 'tc' + transaction.id)
                                        .text(categories[cat].desc)
                                    )
                                    .append(
                                    $('<div></div>')
                                        .addClass('ui-block-c transaction-details')
                                        .attr('id', 'td' + transaction.id)
                                        .text(transaction.desc)
                                    )
                                    .append(
                                    $('<div></div>')
                                        .addClass('ui-block-d transaction-details')
                                        .attr('id', 'tv' + transaction.id)
                                        .text(transaction.value + ' CHF')
                                    )
                                )
                        );

                    }
                }
            }
        });
    }
}


function setHomePage() {
    var storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts == null) {
        $('#accountOverviewHome').css('display', 'none');
    } else {
        $('.accounts-none').css('display', 'none');
        $('#accountOverviewHome').css('display', 'block');
        // Parse JSON of Accounts
        var obj = JSON.parse(storedAccounts);
        var accounts = obj.accounts;

        $('.account').remove();

        // Add HTML-Element for each Account
        for (i = 0; i < accounts.length; i++) {

            var account = accounts[i];
            appendAccountOverview(accounts[i], 'accountOverviewHome');
        }
    }
}

function saveAccount() {

    console.log("Account Saved");
    var name = $('#nameAccount').val();
    var balance = $('#balanceAccount').val();

    if (localStorage.getItem('accounts') == null) {

        var accounts = {
            'accounts': [
                {
                    'id': 1, 'name': name, 'balance': balance
                }
            ]
        };
        localStorage.setItem('accounts', JSON.stringify(accounts));

    } else {
        var obj = JSON.parse(localStorage.getItem('accounts'));
        var accounts = obj.accounts;
        var t = accounts.length;
        var newAccount = {
            'id': t + 1, 'name': name, 'balance': balance
        };

        obj.accounts[t] = newAccount;
        localStorage.setItem('accounts', JSON.stringify(obj));
    }
    setHomePage();
    console.log(localStorage.getItem('accounts'));
}