
$('.collection-item').on('click', function(){

  var $badge = $('.badge', this);
  if($badge.length == 0) {

    $badge = $('<span class="badge brown-text">0</span>').appendTo(this);
    var nomeProduto = this.firstChild.textContent;
    Materialize.toast(nomeProduto + ' adicionado', 1000);
  }

  $badge.text(parseInt($badge.text()) + 1);

});

$('#confirmar').on('click', function(){

  var texto = '';

  $('.badge').parent().each(function(){
    var produto = this.firstChild.textContent;
    var quantidade = this.lastChild.textContent;

    texto += produto + ": " + quantidade + ", ";
  });
  $('#resumo').text(texto);
});

$('.modal-trigger').leanModal();

$('.collection').on('click', '.badge', function(){
  $(this).remove();
  return false;
});

$('.acao-limpar').on('click', function() {
  $('#numero-mesa').val('');
  $('.badge').remove();
});

$('.scan-qrcode').on('click', function(){
  cordova.plugins.barcodeScanner.scan(function(resultado){
    if(resultado.text) {
      Materialize.toast('Mesa' + resultado.text, 2000);
      $('#numero-mesa').val(resultado.text);
    }
  },
  function(erro) {
    Materialize.toast('Erro' + erro, 2000, 'red-text');
  });
});


// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
  $("#pedidosListaConteudo").empty();
  // var db = window.sqlitePlugin.openDatabase({name: "my.db"});
  // // ...
  var myDB = window.sqlitePlugin.openDatabase({name: "garconapp.db"});

  myDB.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS pedidos (id integer primary key, mesa integer, pedido text)', [],
    function(tx, result) {
      alert("Table created successfully");
    },
    function(error) {
      alert("Error occurred while creating the table.");
      myDB.close();
    });
  });

  myDB.transaction(function(tx) {
    tx.executeSql('SELECT * FROM pedidos', [], function (tx, results) {
      var len = results.rows.length;
      // $("#rowCount").append(len);
      for (i = 0; i < len; i++){
        $("#pedidosListaConteudo").append("<div class='collection-item waves-effect black-text'>"+results.rows.item(i).id+" - "+results.rows.item(i).mesa+" - "+results.rows.item(i).pedido+"</div>");
      }
    }, null);
  });
}

$('.acao-finalizar').click(function() {
  var mesa = $('#numero-mesa').val();
  var pedido = $('#resumo').text();

  // var myDataRef = new Firebase('https://intense-heat-3989.firebaseio.com/');
  //
  // if(myDataRef) {
  //   myDataRef.push({mesa: mesa, pedido: pedido});
  // }

  myDB.transaction(function(transaction) {
    var executeQuery = "INSERT INTO pedidos (mesa, pedido) VALUES (?,?)";
    transaction.executeSql(executeQuery, [mesa,pedido], function(tx, result) {
      alert('Inserted -> ' + result);
    },
    function(error){
      alert('Error occurred');
    });
  });

  // $.ajax({
  //   url: 'http://cozinhapp.sergiolopes.org/novo-pedido',
  //   data: {
  //     mesa: $('#numero-mesa').val(),
  //     pedido: $('#resumo').text()
  //   },
  //   success: function(resposta) {
  //     Materialize.toast(resposta, 2000);
  //
  //     $('#numero-mesa').val('');
  //     $('.badge').remove();
  //   },
  //   error: function(erro){
  //     Materialize.toast(erro.responseText, 3000, 'red-text');
  //   }
  // });

});
