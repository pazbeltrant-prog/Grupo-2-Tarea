$(document).ready(function () {
  console.log("JQuery cargado y listo");

  /* =====================================================
     ARRAY CENTRAL DE FAVORITOS
     -----------------------------------------------------
     👉 Esta variable es la ÚNICA fuente de verdad
     👉 Todo (iconos, contador, dropdown) depende de ella
  ===================================================== */
  let favorites = [];

  /* =====================================================
     EVENTO: CLICK EN CORAZÓN DE CADA PRODUCTO
     -----------------------------------------------------
     Se ejecuta cuando el usuario hace click en ❤️
  ===================================================== */
  $(".btn-fav").on("click", function () {
    /* ======================================
       OBTENER DATOS DEL PRODUCTO
       --------------------------------------
       Se buscan desde la tarjeta (card)
    ====================================== */
    const card = $(this).closest(".product-card");
    const productId = card.data("id");
    const productTitle = card.find(".card-title").text();
    const productImg = card.find("img").attr("src");
    const productPrice = card.find(".card-text").text();

    /* ======================================
       SI YA ES FAVORITO → SE ELIMINA
    ====================================== */
    if ($(this).hasClass("fav-active")) {
      // Cambiar icono a corazón vacío gris
      $(this)
        .removeClass("fav-active bi-heart-fill text-danger")
        .addClass("bi-heart text-secondary");

      // Eliminar producto del array
      favorites = favorites.filter((p) => p.id !== productId);

      // Mostrar mensaje
      mostrarToast(`"${productTitle}" eliminado de favoritos.`);
    } else {
      /* ======================================
         SI NO ES FAVORITO → SE AGREGA
      ====================================== */

      // Cambiar icono a corazón lleno rojo
      $(this)
        .removeClass("bi-heart text-secondary")
        .addClass("fav-active bi-heart-fill text-danger");

      // Agregar producto al array
      favorites.push({
        id: productId,
        title: productTitle,
        img: productImg,
        price: productPrice,
      });

      // Mostrar mensaje
      mostrarToast(`"${productTitle}" añadido a favoritos.`);
    }

    // Refrescar dropdown y contador
    actualizarNavbarFavorites();
  });

  /* =====================================================
     FUNCIÓN: ACTUALIZAR DROPDOWN DE FAVORITOS
     -----------------------------------------------------
     - Contador
     - Lista
     - Botón eliminar ❌
  ===================================================== */
  function actualizarNavbarFavorites() {
    const $favList = $("#fav-list");
    const $favCount = $("#fav-count");

    // Limpiar contenido previo
    $favList.empty();

    // Si hay favoritos
    if (favorites.length > 0) {
      // Mostrar contador
      $favCount.text(favorites.length).show();

      // Recorrer favoritos
      favorites.forEach((prod) => {
        /* ======================================
           HTML DE CADA ITEM DEL DROPDOWN
           Incluye botón ❌ con data-id
        ====================================== */
        const itemHtml = `
          <li class="d-flex align-items-center justify-content-between mb-2 border-bottom pb-2"
              data-id="${prod.id}">

            <div class="d-flex align-items-center">
              <img src="${prod.img}" class="fav-thumbnail" alt="${prod.title}">
              <div class="d-flex flex-column">
                <span class="fw-bold" style="font-size: 0.9rem;">${prod.title}</span>
                <span class="text-muted" style="font-size: 0.8rem;">${prod.price}</span>
              </div>
            </div>

            <!-- BOTÓN ELIMINAR -->
            <i class="bi bi-x-circle btn-remove-fav"></i>
          </li>
        `;

        $favList.append(itemHtml);
      });
    } else {
      // Si no hay favoritos
      $favCount.hide();
      $favList.html(
        '<li class="text-center text-muted">No tienes favoritos aún.</li>'
      );
    }
  }

  /* =====================================================
     EVENTO: ELIMINAR FAVORITO DESDE DROPDOWN
     -----------------------------------------------------
     👉 Delegación de eventos
     👉 Funciona aunque la lista se regenere
  ===================================================== */
  $("#fav-list").on("click", ".btn-remove-fav", function (event) {

 // 🔒 Evita que Bootstrap cierre el dropdown
  event.stopPropagation();

    // Obtener el <li> padre
    const li = $(this).closest("li");
    const productId = li.data("id");

    // Buscar producto eliminado (para el mensaje)
    const producto = favorites.find((p) => p.id === productId);

    // Eliminar del array
    favorites = favorites.filter((p) => p.id !== productId);

    /* ======================================
       ACTUALIZAR ICONO EN LA TARJETA
    ====================================== */
    $(`.product-card[data-id="${productId}"]`)
      .find(".btn-fav")
      .removeClass("fav-active bi-heart-fill text-danger")
      .addClass("bi-heart text-secondary");

    // Refrescar UI
    actualizarNavbarFavorites();

    // Mensaje
    if (producto) {
      mostrarToast(`"${producto.title}" eliminado de favoritos.`);
    }
  });

  /* =====================================================
     FUNCIÓN: MOSTRAR TOAST
     -----------------------------------------------------
     Mensajes visuales al usuario
  ===================================================== */
  function mostrarToast(mensaje) {
    $("#toast-message").text(mensaje);
    const toastEl = document.getElementById("favToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
});
