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
    charts
  } = useInventoryDashboard();

  // Lista de tarjetas de gráficos
  const chartCardsList = [
    {
      key: "expensesVsOrdersData",
      title: "Gastos vs Órdenes de Entrada",
      render: <Line data={charts.expensesVsOrders} options={chartOptions} />,
    },
    {
      key: "expensesByCategory",
      title: "Gastos por Categoría",
      render: <Bar data={charts.expensesByCategory} options={chartOptions} />,
    },
    {
      key: "paymentMethods",
      title: "Gastos por Método de Pago",
      render: <Bar data={charts.paymentMethods} options={chartOptions} />,
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