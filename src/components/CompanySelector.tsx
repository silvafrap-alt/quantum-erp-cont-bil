import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveCompany } from "../store/companySlice";

export default function CompanySelector() {
  const dispatch = useAppDispatch();
  const { list, activeId } = useAppSelector((state) => state.companies);

  return (
    <select
      value={activeId || ""}
      onChange={(e) => dispatch(setActiveCompany(e.target.value))}
    >
      {list.map((company) => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
}
