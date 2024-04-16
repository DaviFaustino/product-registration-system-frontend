<template>
    <div class="w-full flex flex-col items-center border-x-2 border-orange-400">
        <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Registrar Tipo</h2>
        <form class="mt-8 space-y-2">
            <div>
                <label for="nome" class="text-orange-600 font-bold">Nome: </label>
                <input type="text" id="nome" class="w-52 border-2 border-orange-400"></input>
            </div>

            <div>
                <label for="categorias" class="text-orange-600 font-bold">Categoria: </label>
                <select id="categorias" class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 text-white">
                    <option value="PANIFICAÇÃO">Panificação</option>
                    <option value="BOBONS_E_SALGADINHOS">Bobons e Salgadinhos</option>
                    <option value="BEBIDAS_E_LATICÍNIOS">Bebidas e Laticínios</option>
                    <option value="ALIMENTOS_REVENDA">Alimentos revenda</option>
                    <option value="LIMPEZA_E_HIGIENE">Limpeza e Higiene</option>
                    <option value="MATÉRIA_PRIMA">Matéria prima</option>
                    <option value="OUTROS">Outros</option>
                </select>
            </div>

            <div>
                <label for="fatorEstoque" class="text-orange-600 font-bold">Fator Estoque Cheio: </label>
                <select id="fatorEstoque"  class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 w-12 text-center text-white">
                    <option value="1">-1</option>
                    <option value="2">-2</option>
                    <option value="3">-3</option>
                    <option value="4">-4</option>
                    <option value="5">-5</option>
                </select>
            </div>

            <div class="h-full"></div>

            <div class="w-full flex justify-center">
                <button class="h-7 w-20 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Salvar</button>
            </div>
        </form>
    </div>

    <div class="h-1 w-full bg-orange-600 my-10"></div>
</template>