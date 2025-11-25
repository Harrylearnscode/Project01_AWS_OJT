"use client"

import { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2 } from "lucide-react"
import UserService from "../../api/service/User.service.jsx"

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user from localStorage
      const currentUser = localStorage.getItem("currentUser")
      if (!currentUser) {
        setError("Vui lòng đăng nhập để xem thông tin cá nhân")
        setLoading(false)
        return
      }

      const userData = JSON.parse(currentUser)
      const sub = userData.id

      if (!sub) {
        setError("Không tìm thấy thông tin người dùng")
        setLoading(false)
        return
      }

      const profile = await UserService.getUserProfile(sub)
      setUser(profile.data)
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      })
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSaveSuccess(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveSuccess(false)

      const currentUser = localStorage.getItem("currentUser")
      const userData = JSON.parse(currentUser)
      const sub = userData.sub || userData.userId

      const updatedUser = await UserService.updateUserProfile(sub, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })

      setUser(updatedUser)
      setIsEditing(false)
      setSaveSuccess(true)

      // Update localStorage with new name
      const updatedCurrentUser = { ...userData, username: formData.name }
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Không thể cập nhật thông tin. Vui lòng thử lại sau.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center max-w-md">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-medium">Cập nhật thông tin thành công!</p>
        </div>
      )}

      {/* Error Message */}
      {error && user && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name || "Người dùng"}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">Chi tiết thông tin</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.name || "Chưa cập nhật"}</p>
                )}
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <p className="text-foreground font-medium">{user?.email || "Chưa cập nhật"}</p>
                <p className="text-xs text-muted-foreground mt-1">Email không thể thay đổi</p>
              </div>
            </div>

            {/* Phone Field */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.phone || "Chưa cập nhật"}</p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.address || "Chưa cập nhật"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
