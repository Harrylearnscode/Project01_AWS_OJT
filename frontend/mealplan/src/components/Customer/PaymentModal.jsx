"use client"

import { useState, useEffect } from "react"
import { X, QrCode, CheckCircle, Clock, AlertCircle } from "lucide-react"

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, orderTotal, orderData }) => {
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, success, failed
  const [countdown, setCountdown] = useState(300) // 5 minutes countdown
  const [orderId] = useState(() => `ORD${Date.now()}`)

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPaymentStatus("failed")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Mock payment simulation
  useEffect(() => {
    if (paymentStatus === "pending") {
      // Simulate payment processing after 10 seconds
      const paymentTimer = setTimeout(() => {
        setPaymentStatus("processing")

        // Simulate successful payment after another 3 seconds
        setTimeout(() => {
          handlePaymentComplete()
        }, 3000)
      }, 10000)

      return () => clearTimeout(paymentTimer)
    }
  }, [paymentStatus])

  const handlePaymentComplete = async () => {
    try {
      // Mock API call to update order status
      const updateData = {
        orderId: orderId,
        status: "paid",
        paymentTime: new Date().toISOString(),
      }

      console.log("[v0] Updating order status:", updateData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPaymentStatus("success")

      // Auto close and trigger success callback after 2 seconds
      setTimeout(() => {
        onPaymentSuccess()
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Failed to update order status:", error)
      setPaymentStatus("failed")
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-card-foreground">Thanh toán đơn hàng</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={paymentStatus === "processing"}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Status */}
          <div className="text-center mb-6">
            {paymentStatus === "pending" && (
              <>
                <div className="w-48 h-48 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Quét mã QR để thanh toán</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Thời gian còn lại: {formatTime(countdown)}</span>
                </div>
              </>
            )}

            {paymentStatus === "processing" && (
              <>
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Đang xử lý thanh toán</h3>
                <p className="text-muted-foreground text-sm">Vui lòng đợi trong giây lát...</p>
              </>
            )}

            {paymentStatus === "success" && (
              <>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Thanh toán thành công!</h3>
                <p className="text-muted-foreground text-sm">Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị</p>
              </>
            )}

            {paymentStatus === "failed" && (
              <>
                <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-destructive mb-2">Thanh toán thất bại</h3>
                <p className="text-muted-foreground text-sm mb-4">Đã hết thời gian thanh toán hoặc có lỗi xảy ra</p>
                <button
                  onClick={onClose}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Thử lại
                </button>
              </>
            )}
          </div>

          {/* Order Details */}
          <div className="border-t border-border pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-medium text-card-foreground">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="text-card-foreground">QR Code</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {paymentStatus === "pending" && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Hướng dẫn:</strong> Mở ứng dụng ngân hàng → Chọn quét QR → Quét mã trên → Xác nhận thanh toán
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
