import { useInventoryDashboard } from "@/hooks/useInventoryDashboard";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

const chartsPerSlider = 2;

const InventoryDashboard: React.FC = () => {
  const {
    timePeriod,
    setTimePeriod,
    periodOptions,
    infoCards,
    chartOptions,
    expensesVsOrdersData,
    ordersByCategoryData,
    monthlyExpensesTrendData,
    topSellingCategoriesData,
    stockDistributionData,
    discountsUsageData,
    warehouseCapacityData,
    salesByRegionData,
    suppliersPerformanceData,
    returnsTrendData,
    ordersByStatusData,
    incomeByMonthData,
  } = useInventoryDashboard();

  // Lista de tarjetas de gráficos
  const chartCardsList = [
    {
      key: "expensesVsOrdersData",
      title: "Gastos vs Órdenes de Entrada",
      render: <Bar data={expensesVsOrdersData} options={chartOptions} />,
    },
    {
      key: "ordersByCategoryData",
      title: "Órdenes por Categoría",
      render: (
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="hidden sm:block">
            <ul className="space-y-2">
              {ordersByCategoryData.labels.map((label, idx) => (
                <li key={label} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-4 h-4 rounded"
                    style={{
                      backgroundColor: ordersByCategoryData.datasets[0].backgroundColor[idx],
                    }}
                  ></span>
                  <span className="text-sm text-primary-900">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ width: 220, height: 220 }}>
            <Pie
              data={ordersByCategoryData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "monthlyExpensesTrendData",
      title: "Tendencia de Gastos Mensuales",
      render: <Line data={monthlyExpensesTrendData} options={chartOptions} />,
    },
    {
      key: "topSellingCategoriesData",
      title: "Categorías Más Vendidas",
      render: <Bar data={topSellingCategoriesData} options={{ ...chartOptions, indexAxis: "y" }} />,
    },
    {
      key: "stockDistributionData",
      title: "Distribución de Stock",
      render: (
        <div className="flex justify-center">
          <div style={{ width: 220, height: 220 }}>
            <Doughnut data={stockDistributionData} options={chartOptions} />
          </div>
        </div>
      ),
    },
    {
      key: "discountsUsageData",
      title: "Uso de Descuentos",
      render: (
        <div className="flex justify-center">
          <div style={{ width: 220, height: 220 }}>
            <Pie data={discountsUsageData} options={chartOptions} />
          </div>
        </div>
      ),
    },
    {
      key: "warehouseCapacityData",
      title: "Capacidad de Bodegas",
      render: (
        <div className="flex justify-center">
          <div style={{ width: 220, height: 220 }}>
            <Doughnut data={warehouseCapacityData} options={chartOptions} />
          </div>
        </div>
      ),
    },
    {
      key: "salesByRegionData",
      title: "Ventas por Región",
      render: <Bar data={salesByRegionData} options={chartOptions} />,
    },
    {
      key: "suppliersPerformanceData",
      title: "Desempeño de Proveedores",
      render: <Bar data={suppliersPerformanceData} options={chartOptions} />,
    },
    {
      key: "returnsTrendData",
      title: "Tendencia de Devoluciones",
      render: <Line data={returnsTrendData} options={chartOptions} />,
    },
    {
      key: "ordersByStatusData",
      title: "Órdenes por Estado",
      render: (
        <div className="flex justify-center">
          <div style={{ width: 220, height: 220 }}>
            <Pie data={ordersByStatusData} options={chartOptions} />
          </div>
        </div>
      ),
    },
    {
      key: "incomeByMonthData",
      title: "Ingresos por Mes",
      render: <Line data={incomeByMonthData} options={chartOptions} />,
    },
  ];

  // Estado para los sliders horizontales
  const [slider1Idx, setSlider1Idx] = React.useState(0);
  const [slider2Idx, setSlider2Idx] = React.useState(chartsPerSlider);

  // Slices para cada slider
  const slider1Charts = chartCardsList.slice(slider1Idx, slider1Idx + chartsPerSlider);
  const slider2Charts = chartCardsList.slice(slider2Idx, slider2Idx + chartsPerSlider);

  return (
    <div className="space-y-6">
      {/* Botones circulares para seleccionar periodo */}
      <div className="flex justify-end gap-2">
        {periodOptions.map((option) => (
          <button
            key={option}
            onClick={() => setTimePeriod(option)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold transition
              ${timePeriod === option
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-primary-600 border-primary-200 hover:bg-primary-50"}
            `}
            aria-label={option}
          >
            {option[0]}
          </button>
        ))}
      </div>
      {/* Slider de tarjetas informativas con Swiper */}
      <div className="pb-2">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1.1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {infoCards.map((card) => (
            <SwiperSlide key={card.title}>
              <Card className="min-w-[220px] flex flex-row items-center p-4">
                <div className="bg-primary-100 rounded-full p-3 mr-4">
                  {card.icon}
                </div>
                <div>
                  <div className="text-sm text-primary-600">{card.title}</div>
                  <div className="text-2xl font-bold text-primary-900">{card.value}</div>
                  <div className="text-xs text-primary-500">{card.description}</div>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Primer slider horizontal */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slider1Charts.map((chart) => (
            <Card key={chart.key}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>{chart.render}</CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 mb-5">
          <button
            onClick={() => setSlider1Idx((idx) => Math.max(0, idx - 1))}
            disabled={slider1Idx === 0}
            className="p-2 rounded-full border bg-white hover:bg-primary-50 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-primary-700">
            {slider1Idx + 1} - {Math.min(slider1Idx + chartsPerSlider, chartCardsList.length)} de {chartCardsList.length}
          </span>
          <button
            onClick={() =>
              setSlider1Idx((idx) =>
                Math.min(idx + 1, chartCardsList.length - chartsPerSlider)
              )
            }
            disabled={slider1Idx + chartsPerSlider >= chartCardsList.length}
            className="p-2 rounded-full border bg-white hover:bg-primary-50 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Segundo slider horizontal */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slider2Charts.map((chart) => (
            <Card key={chart.key}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>{chart.render}</CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 mb-2">
          <button
            onClick={() => setSlider2Idx((idx) => Math.max(chartsPerSlider, idx - 1))}
            disabled={slider2Idx === chartsPerSlider}
            className="p-2 rounded-full border bg-white hover:bg-primary-50 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-primary-700">
            {slider2Idx + 1} - {Math.min(slider2Idx + chartsPerSlider, chartCardsList.length)} de {chartCardsList.length}
          </span>
          <button
            onClick={() =>
              setSlider2Idx((idx) =>
                Math.min(idx + 1, chartCardsList.length - chartsPerSlider + chartsPerSlider)
              )
            }
            disabled={slider2Idx + chartsPerSlider > chartCardsList.length}
            className="p-2 rounded-full border bg-white hover:bg-primary-50 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;