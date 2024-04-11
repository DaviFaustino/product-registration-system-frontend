<template>
   <header class="flex flex-col w-full items-center justify-center h-72 bg-orange-300">
      <div class="flex flex-col h-full w-full items-center justify-center">
         <img src="./assets/Logo PL.png" class="h-48 hover:drop-shadow-[0px_0px_10px_rgba(67,20,7,0.5)] duration-300"><img/>
      </div>

      <nav class="my-1">
         <RouterLink class="text-orange-950 text-lg hover:text-black" to="/gerenciamento">Gerenciamento</RouterLink>
      </nav>
   </header>

   <main class="flex flex-col items-center justify-center w-full">
      <RouterView />
   </main>
</template>