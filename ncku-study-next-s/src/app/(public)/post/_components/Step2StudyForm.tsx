import { useFormContext, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function Step2StudyForm() {
  const t = useTranslations("post");
  const { control } = useFormContext();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ id: string; name: string }[]>("/categories"),
  });

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("title")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("year")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("major")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 資訊工程學系" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="studyCategories"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">{t("category")}</FormLabel>
              <FormDescription>Select at least one category</FormDescription>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories?.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name="studyCategories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id.toString()])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== item.id.toString()
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("content")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[200px]"
                placeholder={t("typeStudyDesc")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
