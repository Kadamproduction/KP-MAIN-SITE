'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  FileText, 
  Menu, 
  X,
  FileImage,
  FileVideo,
  ExternalLink
} from 'lucide-react';

// Interfaces for our state elements
interface DBImage {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
  // Local flags
  isLocal?: boolean;
  localFile?: File;
}

interface DBVideo {
  id: string;
  video_url: string;
  order_index: number;
  isLocal?: boolean;
  localFile?: File;
}

interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
}

interface DBServiceImage {
  id: number;
  service_title: string;
  image_url: string;
  isLocal?: boolean;
  localFile?: File;
}

const CATEGORIES = ['All Events', 'Weddings', 'Festivals', 'Concerts', 'Road Shows'];

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout } = useAuth();

  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'gallery' | 'videos' | 'services' | 'settings'>('gallery');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [images, setImages] = useState<DBImage[]>([]);
  const [videos, setVideos] = useState<DBVideo[]>([]);
  const [serviceImages, setServiceImages] = useState<DBServiceImage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ email: '', phone_1: '', phone_2: '' });
  
  // Unsaved changes tracking states
  const [initialImages, setInitialImages] = useState<string>('');
  const [initialVideos, setInitialVideos] = useState<string>('');
  const [initialServiceImages, setInitialServiceImages] = useState<string>('');
  const [initialSettings, setInitialSettings] = useState<string>('');
  
  // Auth security reset rate limiting states
  const [resetCount, setResetCount] = useState(0);
  const [lastResetMonth, setLastResetMonth] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  // Items marked for deletion (to be removed from Supabase Storage and DB on save)
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [deletedVideoUrls, setDeletedVideoUrls] = useState<string[]>([]);
  const [deletedVideoIds, setDeletedVideoIds] = useState<string[]>([]);

  // UI state overlays
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Category selection for gallery view
  const [selectedGalleryCat, setSelectedGalleryCat] = useState<string>('All Events');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // File upload input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const serviceInputRef = useRef<HTMLInputElement>(null);
  const [activeServiceIdToChange, setActiveServiceIdToChange] = useState<number | null>(null);

  // Verify auth on mount
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Load database items on mount
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch images
      const dbImages = await supabase.from('gallery_images').select('order_index', 'asc');
      setImages(dbImages);
      setInitialImages(JSON.stringify(dbImages));

      // 2. Fetch videos
      const dbVideos = await supabase.from('stage_videos').select('order_index', 'asc');
      setVideos(dbVideos);
      setInitialVideos(JSON.stringify(dbVideos));

      // 3. Fetch site settings
      const dbSettingsList = await supabase.from('site_settings').select('id', 'asc');
      if (dbSettingsList.length > 0) {
        const item = dbSettingsList[0];
        const loadedSettings = { email: item.email, phone_1: item.phone_1, phone_2: item.phone_2 };
        setSettings(loadedSettings);
        setInitialSettings(JSON.stringify(loadedSettings));
      }

      // 4. Fetch service images
      const dbServiceImages = await supabase.from('service_images').select('id', 'asc');
      setServiceImages(dbServiceImages);
      setInitialServiceImages(JSON.stringify(dbServiceImages));

      // 5. Fetch auth reset tracking (3 resets limit per month)
      const dbTrackingList = await supabase.from('auth_reset_tracking').select('id', 'asc');
      if (dbTrackingList && dbTrackingList.length > 0) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const tracking = dbTrackingList[0];
        if (tracking.last_reset_month === currentMonth) {
          setResetCount(tracking.reset_count);
        } else {
          setResetCount(0);
        }
        setLastResetMonth(tracking.last_reset_month);
      }

      // Reset deletions tracking queues
      setDeletedImageUrls([]);
      setDeletedImageIds([]);
      setDeletedVideoUrls([]);
      setDeletedVideoIds([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if unsaved changes exist
  const hasChanges = () => {
    // Check settings difference
    if (JSON.stringify(settings) !== initialSettings) return true;
    
    // Check images difference (including count, order, category, or local staging additions)
    const currentImagesSerialized = JSON.stringify(images.map(img => ({
      id: img.id,
      category: img.category,
      image_url: img.image_url,
      order_index: img.order_index
    })));
    const cleanInitialImages = JSON.stringify(JSON.parse(initialImages || '[]').map((img: any) => ({
      id: img.id,
      category: img.category,
      image_url: img.image_url,
      order_index: img.order_index
    })));
    if (currentImagesSerialized !== cleanInitialImages) return true;

    // Check videos difference
    const currentVideosSerialized = JSON.stringify(videos.map(vid => ({
      id: vid.id,
      video_url: vid.video_url,
      order_index: vid.order_index
    })));
    const cleanInitialVideos = JSON.stringify(JSON.parse(initialVideos || '[]').map((vid: any) => ({
      id: vid.id,
      video_url: vid.video_url,
      order_index: vid.order_index
    })));
    if (currentVideosSerialized !== cleanInitialVideos) return true;

    // Check service images difference
    const currentServiceImagesSerialized = JSON.stringify(serviceImages.map(s => ({
      id: s.id,
      image_url: s.image_url
    })));
    const cleanInitialServiceImages = JSON.stringify(JSON.parse(initialServiceImages || '[]').map((s: any) => ({
      id: s.id,
      image_url: s.image_url
    })));
    if (currentServiceImagesSerialized !== cleanInitialServiceImages) return true;

    return false;
  };

  // Drag and Drop reordering logic helpers
  const reorderImages = (startIndex: number, endIndex: number) => {
    if (selectedGalleryCat === 'All Events') {
      const reordered = Array.from(images);
      const [removed] = reordered.splice(startIndex, 1);
      reordered.splice(endIndex, 0, removed);
      
      const updated = reordered.map((img, idx) => ({ ...img, order_index: idx }));
      setImages(updated);
    } else {
      const categoryImages = images.filter(img => img.category === selectedGalleryCat);
      const nonCategoryImages = images.filter(img => img.category !== selectedGalleryCat);

      const reorderedCat = Array.from(categoryImages);
      const [removed] = reorderedCat.splice(startIndex, 1);
      reorderedCat.splice(endIndex, 0, removed);

      // Re-index category images order
      const updatedCat = reorderedCat.map((img, idx) => ({ ...img, order_index: idx }));

      setImages([...nonCategoryImages, ...updatedCat]);
    }
  };

  const reorderVideos = (startIndex: number, endIndex: number) => {
    const reordered = Array.from(videos);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);

    const updated = reordered.map((vid, idx) => ({ ...vid, order_index: idx }));
    setVideos(updated);
  };

  // Image category upload helpers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (selectedGalleryCat === 'All Events') {
      alert('Please select a specific category (e.g. Weddings, Festivals) to upload images.');
      return;
    }

    const catImages = images.filter(img => img.category === selectedGalleryCat);

    if (catImages.length >= 5) {
      alert(`Upload limit reached! You can only have a maximum of 5 images in the ${selectedGalleryCat} category.`);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    const newImage: DBImage = {
      id: Math.random().toString(36).substring(7), // Temp ID
      category: selectedGalleryCat,
      image_url: localUrl,
      order_index: catImages.length,
      isLocal: true,
      localFile: file
    };

    setImages([...images, newImage]);
  };

  const deleteImageItem = (imgToDelete: DBImage) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      if (!imgToDelete.isLocal) {
        // Add to deletion queues
        setDeletedImageIds([...deletedImageIds, imgToDelete.id]);
        setDeletedImageUrls([...deletedImageUrls, imgToDelete.image_url]);
      }
      
      const remainingImages = images.filter(img => img.id !== imgToDelete.id);
      // Re-index remaining images within this category
      const nonCat = remainingImages.filter(img => img.category !== imgToDelete.category);
      const cat = remainingImages.filter(img => img.category === imgToDelete.category)
                                   .map((img, idx) => ({ ...img, order_index: idx }));
      
      setImages([...nonCat, ...cat]);
    }
  };

  // Stage Video upload helpers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (videos.length >= 6) {
      alert('Upload limit reached! You can only have a maximum of 6 stage videos total.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    const newVideo: DBVideo = {
      id: Math.random().toString(36).substring(7), // Temp ID
      video_url: localUrl,
      order_index: videos.length,
      isLocal: true,
      localFile: file
    };

    setVideos([...videos, newVideo]);
  };

  const deleteVideoItem = (vidToDelete: DBVideo) => {
    if (window.confirm('Are you sure you want to remove this video?')) {
      if (!vidToDelete.isLocal) {
        setDeletedVideoIds([...deletedVideoIds, vidToDelete.id]);
        setDeletedVideoUrls([...deletedVideoUrls, vidToDelete.video_url]);
      }

      const remainingVideos = videos.filter(vid => vid.id !== vidToDelete.id)
                                    .map((vid, idx) => ({ ...vid, order_index: idx }));
      setVideos(remainingVideos);
    }
  };

  const handleCategoryChange = (imageToEdit: DBImage, newCategory: string) => {
    // Check if the target category already has 5 images
    const targetCount = images.filter(img => img.category === newCategory).length;
    if (targetCount >= 5) {
      alert(`Cannot change category: the target category "${newCategory}" already has the maximum limit of 5 images.`);
      return;
    }

    // Change category
    setImages(prev => prev.map(img => {
      if (img.id === imageToEdit.id) {
        const targetCatImages = prev.filter(i => i.category === newCategory);
        return {
          ...img,
          category: newCategory,
          order_index: targetCatImages.length
        };
      }
      return img;
    }));

    // Close editing mode
    setEditingImageId(null);
  };

  const triggerServiceImageChange = (serviceId: number) => {
    setActiveServiceIdToChange(serviceId);
    serviceInputRef.current?.click();
  };

  const handleSendResetRequest = async () => {
    if (!token) return;
    const confirmSend = window.confirm("Are you sure you want to send a credential reset request link to kadamproductionweb@gmail.com? Clicking the link in the email will allow you to update your admin username and password.");
    if (!confirmSend) return;

    setSendingReset(true);
    setErrorMsg(null);
    try {
      // 1. Fetch tracking count to double-check client-side
      const currentMonth = new Date().toISOString().slice(0, 7);
      const dbTrackingList = await supabase.from('auth_reset_tracking').select('id', 'asc');
      let count = 0;
      if (dbTrackingList && dbTrackingList.length > 0) {
        const tracking = dbTrackingList[0];
        if (tracking.last_reset_month === currentMonth) {
          count = tracking.reset_count;
        }
      }

      if (count >= 3) {
        throw new Error("Reset limit reached: You can only reset admin credentials a maximum of 3 times per calendar month.");
      }

      // 2. Call Supabase Auth recover link generator API
      const response = await fetch('https://vrwhhajqjsrkripwalfp.supabase.co/auth/v1/recover', {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_Hm8_WV0IqLb1BBVjE-jYpQ_Ij8vnBDI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'kadamproductionweb@gmail.com' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || errorData.error_description || 'Failed to send recovery email link.');
      }

      // 3. Update database counter
      await supabase.from('auth_reset_tracking').update({
        reset_count: count + 1,
        last_reset_month: currentMonth
      }, 'id', 1, token);

      setResetCount(count + 1);
      alert("Verification email link successfully sent to kadamproductionweb@gmail.com! Please check your email inbox to set your new username and password.");
    } catch (err: any) {
      alert(err.message || 'An error occurred while sending reset email.');
      setErrorMsg(err.message || 'An error occurred while sending reset email.');
    } finally {
      setSendingReset(false);
    }
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || activeServiceIdToChange === null) return;
    const file = files[0];
    
    const localUrl = URL.createObjectURL(file);
    setServiceImages(prev => prev.map(s => {
      if (s.id === activeServiceIdToChange) {
        return {
          ...s,
          image_url: localUrl,
          isLocal: true,
          localFile: file
        };
      }
      return s;
    }));
  };

  // Database and Storage save logic orchestrator
  const handleSaveAllChanges = async () => {
    if (!token) return;
    setShowConfirmModal(false);
    setSaveLoading(true);
    setErrorMsg(null);

    try {
      // 1. Storage Operations: Delete removed images from Supabase Storage
      if (deletedImageUrls.length > 0) {
        const filenames = deletedImageUrls.map(url => url.split('/').pop() || '').filter(name => name !== '');
        if (filenames.length > 0) {
          await supabase.storage.from('assets').remove(filenames, token);
        }
        // Delete rows from DB
        for (const id of deletedImageIds) {
          await supabase.from('gallery_images').delete('id', id, token);
        }
      }

      // Delete removed videos from Supabase Storage
      if (deletedVideoUrls.length > 0) {
        const filenames = deletedVideoUrls.map(url => url.split('/').pop() || '').filter(name => name !== '');
        if (filenames.length > 0) {
          await supabase.storage.from('assets').remove(filenames, token);
        }
        // Delete rows from DB
        for (const id of deletedVideoIds) {
          await supabase.from('stage_videos').delete('id', id, token);
        }
      }

      // 2. Upload and insert newly added images
      for (const img of images) {
        if (img.isLocal && img.localFile) {
          const timestamp = Date.now();
          const cleanName = `${timestamp}_${img.localFile.name}`;
          // Upload to storage bucket
          const publicUrl = await supabase.storage.from('assets').upload(cleanName, img.localFile, token);
          // Insert row in DB
          await supabase.from('gallery_images').insert({
            category: img.category,
            image_url: publicUrl,
            order_index: img.order_index
          }, token);
        } else {
          // Update order index of existing images
          await supabase.from('gallery_images').update({
            order_index: img.order_index
          }, 'id', img.id, token);
        }
      }

      // 3. Upload and insert newly added videos
      for (const vid of videos) {
        if (vid.isLocal && vid.localFile) {
          const timestamp = Date.now();
          const cleanName = `${timestamp}_${vid.localFile.name}`;
          const publicUrl = await supabase.storage.from('assets').upload(cleanName, vid.localFile, token);
          await supabase.from('stage_videos').insert({
            video_url: publicUrl,
            order_index: vid.order_index
          }, token);
        } else {
          // Update order index of existing videos
          await supabase.from('stage_videos').update({
            order_index: vid.order_index
          }, 'id', vid.id, token);
        }
      }

      // 4. Upload and update service images
      for (const s of serviceImages) {
        if (s.isLocal && s.localFile) {
          const timestamp = Date.now();
          const cleanName = `${timestamp}_${s.localFile.name}`;
          const publicUrl = await supabase.storage.from('assets').upload(cleanName, s.localFile, token);

          // Delete old file from storage to save space
          try {
            const oldItem = JSON.parse(initialServiceImages).find((item: any) => item.id === s.id);
            if (oldItem && oldItem.image_url) {
              const oldFilename = oldItem.image_url.split('/').pop() || '';
              if (oldFilename && !oldFilename.startsWith('Untitled') && !oldFilename.startsWith('ChatGPT')) {
                await supabase.storage.from('assets').remove([oldFilename], token);
              }
            }
          } catch (e) {
            console.warn('Could not remove old service image file:', e);
          }

          // Update DB row
          await supabase.from('service_images').update({
            image_url: publicUrl
          }, 'id', s.id, token);
        }
      }

      // 5. Save Site settings (row id = 1)
      await supabase.from('site_settings').update(settings, 'id', 1, token);

      // Refresh page data and update initial references
      await fetchData();
      
      // Trigger Success Toast banner
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving your changes. Please retry.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#8B5CF6] animate-spin" />
        <p className="text-zinc-500 text-sm font-space-grotesk tracking-widest uppercase">Loading Panel Settings...</p>
      </div>
    );
  }

  const categoryImages = selectedGalleryCat === 'All Events' 
    ? [...images].sort((a, b) => a.order_index - b.order_index)
    : images.filter(img => img.category === selectedGalleryCat).sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="min-h-screen bg-black text-white font-space-grotesk flex flex-col md:flex-row select-none">
      
      {/* SUCCESS OVERLAY TOAST */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-2xl backdrop-blur-md animate-fade-in max-w-[400px]">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-emerald-400">Save Successful!</h4>
            <p className="text-xs text-zinc-300 mt-1 leading-normal">
              Changes saved successfully! The updates will be live on the website within 5 minutes.
            </p>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-[450px] rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Save These Changes?</h3>
            <p className="text-sm text-zinc-450 leading-relaxed mb-6">
              Are you sure you want to save these changes? This will immediately update the database and display on the live website.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold text-sm hover:bg-zinc-850 transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAllChanges}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition duration-200 cursor-pointer"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVING STATE OVERLAY SCREEN */}
      {saveLoading && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-[#8B5CF6] animate-spin" />
          <h3 className="font-bold text-lg text-white">Saving Changes to Cloud...</h3>
          <p className="text-zinc-550 text-xs tracking-widest uppercase">Syncing media files & database tables</p>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden w-full h-16 border-b border-white/10 bg-zinc-950 flex items-center justify-between px-6 z-30">
        <span className="font-bold text-md tracking-wider">KP ADMIN PANEL</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center hover:bg-zinc-900 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR SIDE PANEL (Collapsible on mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 w-[280px] border-r border-white/10 bg-zinc-950 flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0 pt-20 md:pt-6' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div className="hidden md:flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Kadam Production Logo" 
              className="w-10 h-10 rounded-full border border-white/10 object-cover flex-shrink-0"
            />
            <div>
              <h2 className="font-bold text-sm tracking-wide text-white leading-none">ADMIN PANEL</h2>
              <span className="text-[10px] text-[#8B5CF6] font-bold tracking-widest uppercase mt-1 block">Kadam Production</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('gallery');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'gallery' 
                  ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <ImageIcon className="w-4 h-4" />
              Gallery Grid
            </button>

            <button
              onClick={() => {
                setActiveTab('videos');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'videos' 
                  ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <VideoIcon className="w-4 h-4" />
              Simple Videos
            </button>

            <button
              onClick={() => {
                setActiveTab('services');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'services' 
                  ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <FileImage className="w-4 h-4" />
              Services Images
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'settings' 
                  ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <SettingsIcon className="w-4 h-4" />
              Site Settings
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-between text-xs text-zinc-400 hover:text-white transition duration-200"
          >
            Visit Live Site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                logout();
              }
            }}
            className="w-full h-12 px-4 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 text-zinc-450 hover:text-red-400 text-sm font-bold flex items-center gap-3 transition duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT DASHBOARD AREA */}
      <main className="flex-1 p-6 md:p-10 max-w-none w-full overflow-y-auto md:h-screen">
        
        {/* HEADER TOOLBAR BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
              {activeTab === 'gallery' && 'Gallery Management'}
              {activeTab === 'videos' && 'Simple Videos'}
              {activeTab === 'services' && 'Services Images'}
              {activeTab === 'settings' && 'Site Information'}
            </h1>
            <p className="text-xs text-zinc-500 tracking-wider mt-1 uppercase">
              {activeTab === 'gallery' && 'Organize display images and categorize weddings, concerts, and more'}
              {activeTab === 'videos' && 'Manage looping background videos for home display. Note: Videos should be under 25 seconds and must be in a 9:16 aspect ratio (Instagram Reel/vertical format).'}
              {activeTab === 'services' && 'Customize background cover photos for all 9 services page items'}
              {activeTab === 'settings' && 'Update contact email, primary/secondary phone numbers, and WhatsApp redirection link'}
            </p>
          </div>

          {/* SMART SAVE ACTION BUTTON (CRITICAL REQUIREMENT) */}
          <div>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!hasChanges()}
              className={`h-12 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg transition duration-300 cursor-pointer
                ${hasChanges() 
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-98' 
                  : 'bg-zinc-900 border border-white/5 text-zinc-550 cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Tab content error banners */}
        {errorMsg && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* -------------------- GALLERY TAB CONTENT -------------------- */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            
            {/* Category tabs selection */}
            <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-zinc-950 border border-white/5 w-fit">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedGalleryCat(cat)}
                  className={`h-10 px-5 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer
                    ${selectedGalleryCat === cat 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-white'
                    }
                  `}
                >
                  {cat === 'All Events' ? `All Events (${images.length})` : `${cat} (${images.filter(img => img.category === cat).length}/5)`}
                </button>
              ))}
            </div>

            {/* Gallery images display grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              {categoryImages.map((image, idx) => (
                <div 
                  key={image.id}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/40 p-3 flex flex-col hover:border-[#8B5CF6]/30 transition duration-300"
                >
                  {/* Image container */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={image.image_url} 
                      alt="Gallery Asset" 
                      className="w-full h-full object-cover brightness-[0.75]" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                      <span className="text-[#8B5CF6] font-extrabold uppercase">{image.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span>Idx: {idx}</span>
                    </div>

                    {/* Local upload indicator badge */}
                    {image.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 px-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteImageItem(image)}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center text-zinc-550 hover:text-red-400 transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {editingImageId === image.id ? (
                        <div className="flex items-center gap-1 relative z-10">
                          <select
                            value={image.category}
                            onChange={(e) => handleCategoryChange(image, e.target.value)}
                            className="h-10 px-2 rounded-xl border border-[#8B5CF6] bg-black text-[10px] font-bold text-white focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.filter(c => c !== 'All Events').map(c => (
                              <option key={c} value={c} className="bg-zinc-950 text-white">{c}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingImageId(null)}
                            className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingImageId(image.id)}
                          className="px-3 h-10 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                          Edit Category
                        </button>
                      )}
                    </div>

                    {/* Reordering Controls (Desktop/Mobile compliant) */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => reorderImages(idx, idx - 1)}
                        disabled={idx === 0}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderImages(idx, idx + 1)}
                        disabled={idx === categoryImages.length - 1}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Card Trigger */}
              {selectedGalleryCat !== 'All Events' && categoryImages.length < 5 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-[#8B5CF6]/30 flex flex-col items-center justify-center gap-3 p-8 text-center transition duration-300 min-h-[220px] cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#8B5CF6]/30 group-hover:bg-[#8B5CF6]/5 transition duration-300">
                    <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-300 block mb-1">ADD CATEGORY PHOTO</span>
                    <p className="text-[10px] text-zinc-550 leading-relaxed uppercase">Supports formats (PNG, JPG, WEBP). Max limit 5 files per category.</p>
                  </div>
                </div>
              )}

              {/* All Events Warning Banner */}
              {selectedGalleryCat === 'All Events' && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/5 flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
                  <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold">
                    You are viewing "All Events". <br/>
                    Please switch to a specific category tab (e.g. Weddings) to upload a new image.
                  </p>
                </div>
              )}

              {/* Limit Hit Banner */}
              {selectedGalleryCat !== 'All Events' && categoryImages.length >= 5 && (
                <div className="rounded-3xl border border-white/5 bg-zinc-950/20 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[220px] opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-650">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1">Category Limit Reached</h4>
                    <p className="text-[10px] text-zinc-650">Max limit of 5 photos is active for {selectedGalleryCat}</p>
                  </div>
                </div>
              )}

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />

            </div>
          </div>
        )}

        {/* -------------------- VIDEOS TAB CONTENT -------------------- */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4 text-xs text-zinc-300 leading-normal">
              <AlertCircle className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
              <span>
                <strong>Disclaimer:</strong> Videos uploaded to this section should be under <strong>25 seconds</strong> and must have a <strong>9:16 aspect ratio</strong> (Instagram Reel / vertical format) for optimal display on mobile devices.
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm font-bold text-zinc-400">
                Videos Counter: <span className="text-white">{videos.length}/6</span>
              </span>
              <span className="text-[11px] text-zinc-500 italic">Looping background display simple videos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              {videos.map((vid, idx) => (
                <div 
                  key={vid.id}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/40 p-3 flex flex-col hover:border-[#8B5CF6]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video 
                      src={vid.video_url} 
                      muted 
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover brightness-[0.7]" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-400 tracking-wider">
                      Index: {idx}
                    </div>

                    {vid.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 px-1">
                    <button
                      onClick={() => deleteVideoItem(vid)}
                      className="w-10 h-10 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center text-zinc-550 hover:text-red-400 transition cursor-pointer"
                      title="Remove video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => reorderVideos(idx, idx - 1)}
                        disabled={idx === 0}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderVideos(idx, idx + 1)}
                        disabled={idx === videos.length - 1}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Card Trigger */}
              {videos.length < 6 ? (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-[#8B5CF6]/30 flex flex-col items-center justify-center gap-3 p-8 text-center transition duration-300 min-h-[320px] cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#8B5CF6]/30 group-hover:bg-[#8B5CF6]/5 transition duration-300">
                    <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 tracking-wider uppercase mb-1">Add Stage Video</h4>
                    <p className="text-[10px] text-zinc-550 max-w-[200px] leading-relaxed mx-auto">
                      Supports formats (MP4, loop clips). Max total limit 6 stage videos.
                    </p>
                  </div>
                  <input 
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoFileChange}
                    accept="video/mp4"
                    className="hidden"
                  />
                </div>
              ) : (
                /* Limit block */
                <div className="rounded-3xl border border-white/5 bg-zinc-950/20 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[320px] opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-650">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1">Total Limit Reached</h4>
                    <p className="text-[10px] text-zinc-650">Max limit of 6 stage videos is active.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* -------------------- SITE SETTINGS TAB CONTENT -------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-[600px] rounded-3xl border border-white/10 bg-zinc-950/40 p-8 shadow-xl">
            <h3 className="font-bold text-md text-white mb-6 uppercase tracking-wider">Contact & Profile Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Primary Contact Email
                </label>
                <input 
                  type="email"
                  placeholder="contact@kadamproduction.in"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Contact Number 1 (Primary - WhatsApp redirection link generator)
                </label>
                <input 
                  type="text"
                  placeholder="9537330003"
                  value={settings.phone_1}
                  onChange={(e) => setSettings({ ...settings, phone_1: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
                <span className="text-[10px] text-zinc-500 leading-normal block mt-2">
                  * Important: Do NOT include country code or special characters (e.g. spaces/hyphens). The website will automatically use this value to construct your WhatsApp URL: <strong>https://wa.me/91[Number]</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Contact Number 2 (Secondary support line)
                </label>
                <input 
                  type="text"
                  placeholder="8866655651"
                  value={settings.phone_2}
                  onChange={(e) => setSettings({ ...settings, phone_2: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
              </div>

              {/* ADMIN ACCOUNT SECURITY SECTION */}
              <div className="border-t border-white/10 pt-8 mt-8 space-y-6">
                <h3 className="font-bold text-md text-white uppercase tracking-wider">Admin Account Security</h3>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Registered Admin Email</h4>
                      <p className="text-sm font-bold text-white">kadamproductionweb@gmail.com</p>
                      <span className="text-[10px] text-zinc-500 leading-normal block mt-1">
                        Resets used this month: <strong className="text-zinc-300">{resetCount} / 3</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleSendResetRequest}
                      disabled={sendingReset || resetCount >= 3}
                      className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#8B5CF6]/30 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {sendingReset ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Generate New Credentials'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- SERVICES TAB CONTENT -------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {serviceImages.map((service) => (
                <div 
                  key={service.id}
                  className="rounded-3xl border border-white/10 bg-zinc-950/40 p-4 flex flex-col hover:border-[#8B5CF6]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black mb-4">
                    <img 
                      src={service.image_url} 
                      alt={service.service_title} 
                      className="w-full h-full object-cover" 
                    />
                    {service.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm tracking-wide text-white uppercase mb-1">
                        {service.service_title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Service Cover image</p>
                    </div>
                    <button
                      onClick={() => triggerServiceImageChange(service.id)}
                      className="mt-6 w-full h-11 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      Replace Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <input 
              type="file"
              ref={serviceInputRef}
              onChange={handleServiceImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

      </main>
    </div>
  );
}
