// src/common/components/Form.tsx
import { textForm } from '@/assets/data';
import { useLanguage } from '@/common/context';
import type { FormProps, FormType, ModalUser, Position, User } from '@/common/interfaces';
import { useState, useLayoutEffect } from 'react';

export const Form = <T extends FormType>({
    type, user, setUser, job, setJob, personal, setPersonal, ...rest
}: FormProps<T> & Record<string, any>) => {
    const [users, setUsers] = useState<ModalUser[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [selectUserValue, setSelectUserValue] = useState<string>('');
    const [selectRoleValue, setSelectRoleValue] = useState<string>('');
    const { lang } = useLanguage();
    const t = textForm[lang] || textForm.en;

    useLayoutEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]") as ModalUser[];
        setUsers(Array.isArray(storedUsers) ? storedUsers : []);
        const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]") as any[];
        setRoles(Array.isArray(storedRoles) ? storedRoles : []);
    }, []);

    // auto-generate uuid for user/personal if missing (run once on mount)
    useLayoutEffect(() => {
        const current = (user ?? personal) as any;
        const hasUuid = !!(current && current.login && current.login.uuid);
        if (!hasUuid) {
            const id = (typeof crypto !== "undefined" && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `id-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
            const updater = (prev: any) => ({ ...(prev || current || {}), login: { ...((prev && prev.login) || (current && current.login) || { uuid: "" }), uuid: id } });
            if (typeof setUser === "function") setUser(updater as any);
            if (typeof setPersonal === "function") setPersonal(updater as any);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const callSetUser = (updater: (prev: any) => any) => { if (typeof setUser === "function") setUser(updater as any); };
    const callSetJob = (updater: (prev: any) => any) => { if (typeof setJob === "function") setJob(updater as any); };
    const callSetPersonal = (updater: (prev: any) => any) => { if (typeof setPersonal === "function") setPersonal(updater as any); };

    const u = (user ?? personal) as ModalUser | undefined ?? {
        name: { title: "", first: "", last: "" },
        dob: { date: "", age: 0 },
        location: { street: { number: 0, name: "" }, city: "", state: "", country: "", postcode: "", coordinates: { latitude: "", longitude: "" }, timezone: { offset: "", description: "" } },
        email: "", login: { uuid: "", username: "", password: "", salt: "", md5: "", sha1: "", sha256: "" }, registered: { date: "", age: 0 }, phone: "", cell: "", id: { name: "", value: "" }, picture: { large: "", medium: "", thumbnail: "" }, nat: ""
    };
    const p = (job as Position) ?? { jobTitle: "", salary: 0 };

    const fieldClassBase = "text-black border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const normalFieldClass = `bg-white ${fieldClassBase} border-gray-300`;
    const errorBorderClass = "border-red-500";

    const natList = (rest.userNationalities || rest.nationalities || []) as Array<{ code?: string; name?: string }>;
    const formErrors = (rest.formErrors || {}) as Record<string, string>;
    const hasError = (key: string) => !!formErrors[key];

    // age calc (birthday equality counts as turned)
    const calcAge = (dateStr?: string): number | undefined => {
        if (!dateStr) return undefined;
        const b = new Date(dateStr);
        if (isNaN(b.getTime())) return undefined;
        const today = new Date();
        let age = today.getFullYear() - b.getFullYear();
        const mmddToday = (today.getMonth() + 1) * 100 + today.getDate();
        const mmddBirth = (b.getMonth() + 1) * 100 + b.getDate();
        if (mmddToday < mmddBirth) age -= 1;
        return age >= 0 ? age : 0;
    };

    // apply updater using callSetUser / callSetPersonal (important)
    const applyUpdater = (updaterForUser: (prev: any) => any) => {
        const candidate = updaterForUser(u);
        // preserve caller intent: update via callSetUser/callSetPersonal
        callSetUser(() => candidate as any);
        callSetPersonal(() => candidate as any);
    };

    // handlers (use applyUpdater / callSetJob where appropriate)
    const handleNameChange = (field: keyof User['name'], value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), name: { ...((prev && prev.name) || u.name), [field]: value } });
        applyUpdater(updater);
    };

    const handleDobChange = (value: string) => {
        const age = calcAge(value);
        const updater = (prev: any) => ({ ...(prev || u), dob: { date: value, age: age ?? 0 } });
        applyUpdater(updater);
    };

    const handleLocationSimple = (field: keyof ModalUser['location'], value: any) => {
        const updater = (prev: any) => ({ ...(prev || u), location: { ...((prev && prev.location) || u.location), [field]: value } });
        applyUpdater(updater);
    };

    const handleStreetChange = (field: keyof ModalUser['location']['street'], value: any) => {
        const updater = (prev: any) => ({ ...(prev || u), location: { ...((prev && prev.location) || u.location), street: { ...(((prev && prev.location) && prev.location.street) || u.location.street), [field]: value } } });
        applyUpdater(updater);
    };

    const handleCoordinatesChange = (field: keyof ModalUser['location']['coordinates'], value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), location: { ...((prev && prev.location) || u.location), coordinates: { ...(((prev && prev.location) && prev.location.coordinates) || u.location.coordinates), [field]: value } } });
        applyUpdater(updater);
    };

    const handleTimezoneChange = (field: keyof ModalUser['location']['timezone'], value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), location: { ...((prev && prev.location) || u.location), timezone: { ...(((prev && prev.location) && prev.location.timezone) || u.location.timezone), [field]: value } } });
        applyUpdater(updater);
    };

    const handleEmailChange = (value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), email: value });
        applyUpdater(updater);
    };

    const handleLoginChange = (field: keyof ModalUser['login'], value: string) => {
        if (field === 'uuid') return;
        const updater = (prev: any) => ({ ...(prev || u), login: { ...(((prev && prev.login) || u.login)), [field]: value } });
        applyUpdater(updater);
    };

    const handleRegisteredChange = (field: keyof ModalUser['registered'], value: any) => {
        const updater = (prev: any) => ({ ...(prev || u), registered: { ...(((prev && prev.registered) || u.registered)), [field]: value } });
        applyUpdater(updater);
    };

    const handlePhoneChange = (field: 'phone' | 'cell', value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), [field]: value });
        applyUpdater(updater);
    };

    const handleIdChange = (field: keyof ModalUser['id'], value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), id: { ...(((prev && prev.id) || u.id)), [field]: value } });
        applyUpdater(updater);
    };

    const handlePictureChange = (field: keyof ModalUser['picture'], value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), picture: { ...(((prev && prev.picture) || u.picture)), [field]: value } });
        applyUpdater(updater);
    };

    const handleNatChange = (value: string) => {
        const updater = (prev: any) => ({ ...(prev || u), nat: value });
        applyUpdater(updater);
    };

    const handleJobTitleChange = (value: string) => {
        callSetJob((prev: any) => ({ ...((prev as any) || p), jobTitle: value }));
    };

    const handleSalaryChange = (value: string | number) => {
        const salary = typeof value === "number" ? value : parseFloat(String(value || "0"));
        callSetJob((prev: any) => ({ ...((prev as any) || p), salary: isNaN(salary) ? 0 : salary }));
    };

    // user select uses unique id/email as value - find by that
    const handleUserChange = (value: string) => {
        setSelectUserValue(value);
        const selectedUser = users.find((uu, idx) => {
            const v = uu.login?.uuid || uu.email || `${uu.name?.first ?? ''}-${uu.name?.last ?? ''}`;
            return String(v) === String(value);
        });
        const updater = (prev: any) => ({ ...(prev || u), user: selectedUser });
        applyUpdater(updater);
    };

    // role select uses id or jobTitle string as value
    const handleRoleChange = (value: string) => {
        setSelectRoleValue(value);
        const found = roles.find((r: any) => (r?.id && String(r.id) === String(value)) || String(r?.jobTitle) === String(value));
        const updater = (prev: any) => ({ ...(prev || u), role: found ? found : value });
        applyUpdater(updater);
    };

    // compute currentUser/currentRole (keep expressions as requested)
    const currentUserValue = ((user as any)?.user?.login?.uuid) || ((personal as any)?.user?.login?.uuid) || ((user as any)?.user?.email) || ((personal as any)?.user?.email) || ((user as any)?.user?.name && `${(user as any).user.name.first}-${(user as any).user.name.last}`) || ((personal as any)?.user?.name && `${(personal as any).user.name.first}-${(personal as any).user.name.last}`) || "";
    const roleValFromUser = (user as any)?.role ?? (personal as any)?.role ?? "";
    const currentRoleValue = typeof roleValFromUser === 'object' ? (roleValFromUser.id ?? roleValFromUser.jobTitle ?? "") : String(roleValFromUser || "");

    // sync local select states when derived values change
    useLayoutEffect(() => {
        // prefer explicit current values, but don't overwrite if user already changed the select manually to same value
        setSelectUserValue(prev => (prev === currentUserValue ? prev : currentUserValue));
        setSelectRoleValue(prev => (prev === currentRoleValue ? prev : currentRoleValue));
    }, [currentUserValue, currentRoleValue, users, roles]);

    // render
    const ageLabel = lang === 'es' ? 'Edad' : 'Age';

    let userFields = null;
    if (type === "usuarios") {
        userFields = (
            <>
                <div className="flex flex-col">
                    <label htmlFor="title">{t.title}</label>
                    <input
                        id="title"
                        type="text"
                        value={u?.name?.title ?? ""}
                        onChange={e => handleNameChange('title', e.target.value)}
                        className={`${normalFieldClass} ${hasError('name.title') ? errorBorderClass : ''}`}
                        required
                    />
                    {hasError('name.title') && <span className="text-red-600 text-sm mt-1">{formErrors['name.title']}</span>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="first">{t.first}</label>
                    <input
                        id="first"
                        type="text"
                        value={u?.name?.first ?? ""}
                        onChange={e => handleNameChange('first', e.target.value)}
                        className={`${normalFieldClass} ${hasError('name.first') ? errorBorderClass : ''}`}
                        required
                    />
                    {hasError('name.first') && <span className="text-red-600 text-sm mt-1">{formErrors['name.first']}</span>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="last">{t.last}</label>
                    <input
                        id="last"
                        type="text"
                        value={u?.name?.last ?? ""}
                        onChange={e => handleNameChange('last', e.target.value)}
                        className={`${normalFieldClass} ${hasError('name.last') ? errorBorderClass : ''}`}
                        required
                    />
                    {hasError('name.last') && <span className="text-red-600 text-sm mt-1">{formErrors['name.last']}</span>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="dob">{t.dob}</label>
                    <input
                        id="dob"
                        type="date"
                        value={u?.dob?.date ? String(u.dob.date).split('T')[0] : ""}
                        onChange={e => handleDobChange(e.target.value)}
                        className={`${normalFieldClass} ${hasError('dob.date') ? errorBorderClass : ''}`}
                        required
                    />
                    {hasError('dob.date') && <span className="text-red-600 text-sm mt-1">{formErrors['dob.date']}</span>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="age">{ageLabel}</label>
                    <input id="age" type="number" value={u?.dob?.age ?? (calcAge(u?.dob?.date) ?? "")} className={`${normalFieldClass} bg-gray-100`} disabled />
                </div>

                {/* Location */}
                <div className="flex flex-col"><label htmlFor="street-number">{t.streetNumber}</label>
                    <input id="street-number" type="number" min={0} value={String(u?.location?.street?.number ?? "")} onChange={e => handleStreetChange('number', Number(e.target.value || 0))} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="street-name">{t.streetName}</label>
                    <input id="street-name" type="text" value={u?.location?.street?.name ?? ""} onChange={e => handleStreetChange('name', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="city">{t.city}</label>
                    <input id="city" type="text" value={u?.location?.city ?? ""} onChange={e => handleLocationSimple('city', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="state">{t.state}</label>
                    <input id="state" type="text" value={u?.location?.state ?? ""} onChange={e => handleLocationSimple('state', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="country">{t.country}</label>
                    <input id="country" type="text" value={u?.location?.country ?? ""} onChange={e => handleLocationSimple('country', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="postcode">{t.postcode}</label>
                    <input id="postcode" type="text" value={String(u?.location?.postcode ?? "")} onChange={e => handleLocationSimple('postcode', e.target.value)} className={normalFieldClass} />
                </div>

                <div className="flex flex-col"><label htmlFor="latitude">{t.latitude}</label>
                    <input id="latitude" type="text" value={u?.location?.coordinates?.latitude ?? ""} onChange={e => handleCoordinatesChange('latitude', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="longitude">{t.longitude}</label>
                    <input id="longitude" type="text" value={u?.location?.coordinates?.longitude ?? ""} onChange={e => handleCoordinatesChange('longitude', e.target.value)} className={normalFieldClass} />
                </div>

                <div className="flex flex-col"><label htmlFor="tz-offset">{t.tzOffset}</label>
                    <input id="tz-offset" type="text" value={u?.location?.timezone?.offset ?? ""} onChange={e => handleTimezoneChange('offset', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="tz-desc">{t.tzDesc}</label>
                    <input id="tz-desc" type="text" value={u?.location?.timezone?.description ?? ""} onChange={e => handleTimezoneChange('description', e.target.value)} className={normalFieldClass} />
                </div>

                <div className="flex flex-col"><label htmlFor="email">{t.email}</label>
                    <input id="email" type="email" value={u?.email ?? ""} onChange={e => handleEmailChange(e.target.value)} className={normalFieldClass} />
                </div>

                {/* Login */}
                <div className="flex flex-col"><label htmlFor="uuid">{t.uuid}</label>
                    <input id="uuid" type="text" value={u?.login?.uuid ?? ""} readOnly className={`${normalFieldClass} bg-gray-100`} />
                </div>
                <div className="flex flex-col"><label htmlFor="username">{t.username}</label>
                    <input id="username" type="text" value={u?.login?.username ?? ""} onChange={e => handleLoginChange('username', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="password">{t.password}</label>
                    <input id="password" type="text" value={u?.login?.password ?? ""} onChange={e => handleLoginChange('password', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="salt">{t.salt}</label>
                    <input id="salt" type="text" value={u?.login?.salt ?? ""} onChange={e => handleLoginChange('salt', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="md5">{t.md5}</label>
                    <input id="md5" type="text" value={u?.login?.md5 ?? ""} onChange={e => handleLoginChange('md5', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="sha1">{t.sha1}</label>
                    <input id="sha1" type="text" value={u?.login?.sha1 ?? ""} onChange={e => handleLoginChange('sha1', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="sha256">{t.sha256}</label>
                    <input id="sha256" type="text" value={u?.login?.sha256 ?? ""} onChange={e => handleLoginChange('sha256', e.target.value)} className={normalFieldClass} />
                </div>

                {/* Registered */}
                <div className="flex flex-col"><label htmlFor="registered-date">{t.regDate}</label>
                    <input id="registered-date" type="date" value={u?.registered?.date ? String(u.registered.date).split('T')[0] : ""} onChange={e => handleRegisteredChange('date', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="registered-age">{t.regAge}</label>
                    <input id="registered-age" type="number" min={0} value={u?.registered?.age ?? 0} onChange={e => handleRegisteredChange('age', Number(e.target.value || 0))} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="phone">{t.phone}</label>
                    <input id="phone" type="text" value={u?.phone ?? ""} onChange={e => handlePhoneChange('phone', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="cell">{t.cell}</label>
                    <input id="cell" type="text" value={u?.cell ?? ""} onChange={e => handlePhoneChange('cell', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="id-name">{t.idName}</label>
                    <input id="id-name" type="text" value={u?.id?.name ?? ""} onChange={e => handleIdChange('name', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="id-value">{t.idValue}</label>
                    <input id="id-value" type="text" value={u?.id?.value ?? ""} onChange={e => handleIdChange('value', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="picture-large">{t.picLarge}</label>
                    <input id="picture-large" type="text" value={u?.picture?.large ?? ""} onChange={e => handlePictureChange('large', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="picture-medium">{t.picMedium}</label>
                    <input id="picture-medium" type="text" value={u?.picture?.medium ?? ""} onChange={e => handlePictureChange('medium', e.target.value)} className={normalFieldClass} />
                </div>
                <div className="flex flex-col"><label htmlFor="picture-thumb">{t.picThumb}</label>
                    <input id="picture-thumb" type="text" value={u?.picture?.thumbnail ?? ""} onChange={e => handlePictureChange('thumbnail', e.target.value)} className={normalFieldClass} />
                </div>

                {/* Nat select */}
                <div className="flex flex-col">
                    <label htmlFor="nat">{t.nat}</label>
                    <select id="nat" value={u?.nat ?? ""} onChange={e => handleNatChange(e.target.value)} className={normalFieldClass}>
                        <option value="">{t.selectNat}</option>
                        {natList.map((n: any, idx: number) => (
                            <option key={n?.code ?? n?.name ?? idx} value={n?.code ?? n?.name ?? String(n)}>
                                {n?.name ?? String(n)}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        );
    }

    let positionFields = null;
    if (type === "puesto") {
        positionFields = (
            <>
                <div className="flex flex-col"><label htmlFor="jobTitle">{t.jobTitle}</label>
                    <input id="jobTitle" type="text" value={(p?.jobTitle) ?? ""} onChange={e => handleJobTitleChange(e.target.value)} className={`${normalFieldClass} ${hasError('job.jobTitle') ? errorBorderClass : ''}`} />
                    {hasError('job.jobTitle') && <span className="text-red-600 text-sm mt-1">{formErrors['job.jobTitle']}</span>}
                </div>
                <div className="flex flex-col"><label htmlFor="salary">{t.salary}</label>
                    <input id="salary" type="number" min={0} value={p?.salary ?? 0} onChange={e => handleSalaryChange(e.target.value)} className={`${normalFieldClass} ${hasError('job.salary') ? errorBorderClass : ''}`} onKeyDown={e => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }} />
                    {hasError('job.salary') && <span className="text-red-600 text-sm mt-1">{formErrors['job.salary']}</span>}
                </div>
            </>
        );
    }

    let selectFields = null;
    if (type === "personal") {
        // compute currentUser value (unique) and currentRole value (kept as requested)
        const currentUserValue = ((user as any)?.user?.login?.uuid) || ((personal as any)?.user?.login?.uuid) || ((user as any)?.user?.email) || ((personal as any)?.user?.email) || ((user as any)?.user?.name && `${(user as any).user.name.first}-${(user as any).user.name.last}`) || ((personal as any)?.user?.name && `${(personal as any).user.name.first}-${(personal as any).user.name.last}`) || "";
        const roleValFromUser = (user as any)?.role ?? (personal as any)?.role ?? "";
        const currentRoleValue = typeof roleValFromUser === 'object' ? (roleValFromUser.id ?? roleValFromUser.jobTitle ?? "") : String(roleValFromUser || "");

        selectFields = (
            <>
                <div className="flex flex-col"><label htmlFor="user">{t.selectUser}</label>
                    <select id="user" value={selectUserValue || currentUserValue} onChange={e => handleUserChange(e.target.value)} className={`${normalFieldClass} overflow-y-auto max-h-40`}>
                        <option value="">{t.selectUser}</option>
                        {users.map((uu, idx) => {
                            const first = uu?.name?.first ?? '';
                            const last = uu?.name?.last ?? '';
                            const val = uu.login?.uuid || uu.email || `${first}-${last}`;
                            const key = uu.login?.uuid || uu.email || `${first}-${last}-${idx}`;
                            return <option key={key} value={val}>{`${first} ${last}`.trim() || uu.login?.username || uu.email}</option>;
                        })}
                    </select>
                </div>
                <div className="flex flex-col"><label htmlFor="role">{t.selectRole}</label>
                    <select id="role" value={selectRoleValue || currentRoleValue} onChange={e => handleRoleChange(e.target.value)} className={`${normalFieldClass} overflow-y-auto max-h-40`}>
                        <option value="">{t.selectRole}</option>
                        {roles.map((r: any, idx: number) => {
                            const key = r?.id ?? `${r?.jobTitle ?? String(r)}-${idx}`;
                            const val = r?.id ?? r?.jobTitle ?? String(r);
                            const label = r?.jobTitle ?? String(r);
                            return <option key={key} value={val}>{label}</option>;
                        })}
                    </select>
                </div>
            </>
        );
        console.log({ selectUserValue: selectUserValue, currentUserValue: currentUserValue, selectRoleValue: selectRoleValue, currentRoleValue: currentRoleValue })
    }

    return (
        <form className={`flex flex-col gap-3 max-h-[75vh] overflow-y-auto overscroll-contain pr-1 `}>
            {userFields}
            {positionFields}
            {selectFields}
        </form>
    );
};
