export default function OrderStats({ orders }) {
  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length
  }

  const stats = [
    { label: "Total Orders", value: orders.length, color: "bg-blue-500" },
    { label: "Pending", value: getStatusCount("PENDING"), color: "bg-yellow-500" },
    { label: "Confirmed", value: getStatusCount("CONFIRMED"), color: "bg-purple-500" },
    { label: "Delivered", value: getStatusCount("DELIVERED"), color: "bg-green-500" },
    { label: "Cancelled", value: getStatusCount("CANCELLED"), color: "bg-red-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} opacity-20`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
