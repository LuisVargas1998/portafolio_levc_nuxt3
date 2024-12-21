export default [
  {
    title: "Home",
    icon: "mdi-view-dashboard-outline",
    to: "/home",
  },
  {
    title: "Vias 4Gy5G ",
    icon: "mdi-road-variant",
    //to: "/piniademo",
    subItems: [
      {
        title: "Procesar video",
        icon: "mdi-upload",
        to: "/proyecto-vias-4gy5g/subir-video",
      },
      {
        title: "Registro de videos",
        icon: "mdi-table-eye",
        to: "/proyecto-vias-4gy5g/registro-videos-usuario",
      },
      {
        title: "Registro de videos Admin",
        icon: "mdi-table-edit",
        to: "/proyecto-vias-4gy5g/registro-videos-admin",
      },
      {
        title: "Mapa",
        icon: "mdi-map-marker-outline",
        to: "/proyecto-vias-4gy5g/pruebas/prueba-con-mapa-leaflet",
      },
    ],
  },
  {
    title: "Cédulas",
    icon: "mdi-card-account-details-outline",
    //to: "/piniademo",
    // subItems: [
    //   {
    //     title: "Registro Videos",
    //     icon: "mdi-table-eye",
    //     to: "/proyecto-vias-4gy5g/registro-videos-usuario",
    //   },
    //   {
    //     title: "Registro Videos Admin",
    //     icon: "mdi-table-edit",
    //     to: "/proyecto-vias-4gy5g/registro-videos-admin",
    //   },
    // ],
  },

  {
    title: "Pruebas",
    icon: "mdi-flask-outline",
    //to: "/piniademo",
    subItems: [
      {
        title: "Sólo mapa",
        icon: "mdi-table-eye",
        to: "/proyecto-vias-4gy5g/ver-en-mapa/mapa_con_clusters",
      },
      {
        title: "Esquema + Mapa",
        icon: "mdi-table-edit",
        to: "/proyecto-vias-4gy5g/ver-en-mapa/esquema_general_detalle_MAPA",
      },
    ],
  },

  // Así iba el original

  // {
  //   title: "Home",
  //   icon: "mdi-view-dashboard-outline",
  //   to: "/home",
  // },
  // {
  //   title: "CubeTable",
  //   icon: "mdi-table",
  //   to: "/cubetable",
  // },
  // {
  //   title: "CubeGraphics",
  //   icon: "mdi-chart-bar",
  //   to: "/cubegraphics",
  // },
  // {
  //   title: "CubeKSQL",
  //   icon: "mdi-chart-tree",
  //   to: "/cubeksql",
  // },
  // {
  //   title: "MilvusTable",
  //   icon: "mdi-account-multiple-check",
  //   to: "/milvustable2",
  // },
  // {
  //   title: "MilvusPage",
  //   icon: "mdi-database-eye",
  //   to: "/milvuspage",
  // },
  // {
  //   title: "Camaras",
  //   icon: "mdi-cctv",
  //   to: "/piniademo",
  //   subItems: [
  //     {
  //       title: "Camara 1",
  //       icon: "mdi-video",
  //       to: "/about",
  //     },
  //     {
  //       title: "Camara 2",
  //       icon: "mdi-video",
  //       to: "/alerts",
  //     },
  //   ],
  // },
  // {
  //   title: "Registros",
  //   icon: "mdi-table",
  //   //to: "/piniademo",
  //   subItems: [
  //     {
  //       title: "Metrocuadrado",
  //       icon: "mdi-database-eye",
  //       to: "/metrocuadrado/registros",
  //     },
  //     {
  //       title: "Ciencuadras",
  //       icon: "mdi-database-eye",
  //       to: "/ciencuadras/registros",
  //     },
  //     {
  //       title: "Fincaraiz",
  //       icon: "mdi-database-eye",
  //       to: "/fincaraiz/registros",
  //     },
  //   ],
  // },
];
