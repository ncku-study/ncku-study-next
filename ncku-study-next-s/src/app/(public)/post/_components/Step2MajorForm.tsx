import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Step2MajorForm() {
  const t = useTranslations("post");
  const { control } = useFormContext();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => apiFetch<{ id: string; name: string }[]>("/departments"),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("category")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("category")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="轉系">{t("categoryTransfer")}</SelectItem>
                  <SelectItem value="輔系">{t("categoryMinor")}</SelectItem>
                  <SelectItem value="雙主修">{t("categoryDouble")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("department")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("department")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="out_maj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("out_maj")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("outMajPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="in_maj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("in_maj")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("inMajPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("score")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="rank_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("rank_1")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 1/50 or 2%" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="rank_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("rank_2")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 1/50 or 2%" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isPass"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("isPass")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("pass")}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("fail")}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("comment")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[150px]"
                placeholder={t("typeMajorDesc")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
