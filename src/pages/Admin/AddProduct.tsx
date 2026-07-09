import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"; // useFieldArray əlavə edildi
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { FiX, FiUpload, FiLoader, FiCheck } from "react-icons/fi";
import type { AddProductFormInput, ApiError, Perfume } from "../../types/perfume";
import type { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Perfume | null;
}

const AddProduct = ({ isOpen, onClose, initialData }: Props) => {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // useForm daxilində "control" əlavə edildi
  const { register, control, handleSubmit, reset } = useForm<AddProductFormInput>({
    defaultValues: {
      isNew: false,
      isRecommended: false,
      gender: "UNISEX",
      variants: [{ ml: 100, price: 0, discountPrice: 0, stock: 0 }] // Standart olaraq minimum 1 variant
    },
  });

  // useFieldArray istifadə edərək "variants" massivini idarə edirik
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        name: initialData.name,
        brand: initialData.brand,
        gender: initialData.gender,
        description: initialData.description,
        isNew: initialData.isNew,
        isRecommended: initialData.isRecommended || false,
        // Redaktə edərkən bütün variantları forma doldururuq
        variants: initialData.variants && initialData.variants.length > 0
          ? initialData.variants.map(v => ({
              id: v.id,
              ml: v.ml,
              price: v.price,
              discountPrice: v.discountPrice || 0,
              stock: v.stock || 0
            }))
          : [{ ml: 100, price: initialData.price || 0, discountPrice: 0, stock: 0 }]
      });
      setImagePreview(initialData.imageUrl);
    } else if (!isOpen) {
      reset({ 
        name: "", 
        brand: "", 
        description: "", 
        isNew: false, 
        isRecommended: false,
        variants: [{ ml: 100, price: 0, discountPrice: 0, stock: 0 }] 
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, reset, isOpen]);

  // Vahid Mutasiya (POST və ya PUT üçün)
  const mutation = useMutation<void, AxiosError<ApiError>, FormData>({
    mutationFn: (data: FormData) => {
      const url = initialData ? `/perfumes/${initialData.id}` : "/perfumes";
      const method = initialData ? "put" : "post";

      return api({
        method: method,
        url: url,
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(initialData ? "Product updated!" : "Product added!");
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Operation failed. Check file types.");
    }
  });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
      });
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
    } catch {
      toast.error("Image processing error");
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit: SubmitHandler<AddProductFormInput> = (values) => {
    if (!initialData && !imageFile) {
      return toast.error("Please upload an image");
    }

    const formData = new FormData();
    
    // Backend root səviyyəsində qiymət tələb edərsə, ən ucuz (və ya ilk) variantın qiymətini təyin edirik
    const primaryPrice = values.variants?.[0]?.price || 0;

    // Backend-in gözlədiyi tam uyğun struktur
    const perfumeData = {
      name: values.name,
      brand: values.brand,
      gender: values.gender,
      description: values.description,
      isNew: values.isNew,
      isRecommended: values.isRecommended,
      price: primaryPrice, // Root səviyyəsində tələb olunan qiymət
      imageUrl: initialData?.imageUrl || null,
      variants: values.variants // Bütün variant siyahısı
    };

    const jsonBlob = new Blob([JSON.stringify(perfumeData)], { type: "application/json" });
    formData.append("perfume", jsonBlob);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-100 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white z-101 shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col font-[Playfair]`}
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-[#F8F9FA]">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tighter">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button aria-label="fix" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form id="add-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Image Upload */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-neutral uppercase tracking-widest">Product Media</span>
            <div className={`relative border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center transition-all bg-gray-50/50 hover:border-black ${!imagePreview ? 'py-16' : 'p-2'}`}>
              {imagePreview ? (
                <div className="relative w-full aspect-square">
                  <img src={imagePreview} className="w-full h-full object-contain rounded-2xl" alt="upload image" />
                </div>
              ) : (
                <div className="text-center text-gray-300">
                  <FiUpload size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase">Click to upload</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImage} accept="image/*" />
            </div>
            {isCompressing && <p className="text-[10px] text-teal-500 animate-pulse font-bold uppercase text-center">Optimizing...</p>}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label className="text-[10px] font-black text-neutral uppercase tracking-widest block mb-1">Perfume Name</label>
              <input {...register("name", { required: true })} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm bg-transparent" />
            </div>

            {/* Brand */}
            <div className="group">
              <label className="text-[10px] font-black text-neutral uppercase tracking-widest block mb-1">Brand</label>
              <input {...register("brand", { required: true })} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm bg-transparent" />
            </div>

            {/* DİNAMİK VARİANTLAR (ML, QIYMƏT, ENDİRİM VƏ STOK) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-neutral uppercase tracking-widest">
                  Product Variants (ML & Prices)
                </span>
                <button 
                  type="button" 
                  onClick={() => append({ ml: 50, price: 0, discountPrice: 0, stock: 0 })}
                  className="text-[10px] font-bold uppercase text-teal-600 hover:underline cursor-pointer"
                >
                  + Add Variant (ML)
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-100 p-4 rounded-3xl bg-gray-50/20 relative space-y-4">
                    {fields.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="absolute top-2 right-4 text-red-500 text-[10px] font-bold uppercase hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-neutral uppercase mb-1 block">Volume (ML)</label>
                        <input 
                          type="number" 
                          {...register(`variants.${index}.ml` as const, { valueAsNumber: true, required: true })} 
                          className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-xs bg-transparent" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral uppercase mb-1 block">Price</label>
                        <input 
                          type="number" 
                          {...register(`variants.${index}.price` as const, { valueAsNumber: true, required: true })} 
                          className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-xs bg-transparent" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral uppercase mb-1 block">Discount</label>
                        <input 
                          type="number" 
                          {...register(`variants.${index}.discountPrice` as const, { valueAsNumber: true })} 
                          className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-xs bg-transparent" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral uppercase mb-1 block">Stock</label>
                        <input 
                          type="number" 
                          {...register(`variants.${index}.stock` as const, { valueAsNumber: true, required: true })} 
                          className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-xs bg-transparent" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-[10px] font-black text-neutral uppercase tracking-widest block mb-1">Gender</label>
              <select {...register("gender")} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm bg-transparent cursor-pointer">
                <option value="MEN">MEN</option>
                <option value="WOMEN">WOMEN</option>
                <option value="UNISEX">UNISEX</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-black text-neutral uppercase tracking-widest block mb-1">Description</label>
              <textarea {...register("description")} rows={3} className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-black transition-all text-sm resize-none bg-transparent" />
            </div>

            {/* Status Flags */}
            <div className="pt-2 border-t border-gray-50 space-y-4">
              <div className="flex justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" {...register("isNew")} className="peer h-5 w-5 appearance-none rounded border border-gray-300 checked:bg-black transition-all" />
                    <FiCheck className="absolute ml-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={12}/>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" {...register("isRecommended")} className="peer h-5 w-5 appearance-none rounded border border-gray-300 checked:bg-black transition-all" />
                    <FiCheck className="absolute ml-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={12}/>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral">Featured</span>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-[#F8F9FA] flex gap-4">
          <button type="button" onClick={onClose} className="cursor-pointer flex-1 py-4 text-[10px] font-bold uppercase border border-gray-200 text-neutral rounded-2xl bg-white hover:text-black hover:border-black transition-all">
            Cancel
          </button>
          <button 
            type="submit" form="add-form" disabled={mutation.isPending || isCompressing}
            className="cursor-pointer flex-1 py-4 text-[10px] font-bold uppercase bg-black text-white rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-200"
          >
            {mutation.isPending ? <FiLoader className="animate-spin" size={16} /> : (initialData ? "Update" : "Save")}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddProduct;