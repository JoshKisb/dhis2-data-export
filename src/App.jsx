import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import React, { useState } from "react";
import classes from "./App.module.css";
import { Button, DatePicker, Form, Input, Select, TreeSelect } from "antd";

const query = {
	me: {
		resource: "me",
	},
    programs: {
        resource: "programs"
    },
    orgs: {
		// userOrgUnits
		resource: "organisationUnits.json",
		params: {
			paging: "false",
			fields: "id,name,path,leaf,level,parent[id]",
		},
	},
};

const { RangePicker } = DatePicker;

const MyApp = () => {
	const { error, loading, data } = useDataQuery(query);
	const [form] = Form.useForm();
	// const [formLayout, setFormLayout] = useState("sample");

	if (error) {
		return <span>{i18n.t("ERROR")}</span>;
	}

	if (loading) {
		return <span>{i18n.t("Loading...")}</span>;
	}
    const programs = data.programs.programs.map(p => ({ value: p.id, label: <span>{p.displayName}</span> }));
    const userOrgUnits = data.orgs.organisationUnits.map((o) => ({
        ...o,
        pId: o.parent?.id,
    })); 
    const units = userOrgUnits.map((unit) => {
        return {
            id: unit.id,
            pId: unit.pId || "",
            value: unit.id,
            title: unit.name,
            isLeaf: unit.leaf,
        };
    });

	return (
		<div className={classes.container}>
			<Form
				layout={`inline`}
				form={form}
				initialValues={{ }}
				onValuesChange={() => {}}
				style={{ maxWidth: "none" }}
			>
				<Form.Item label="Program" name="program">
					<Select
                        style={{minWidth: "350px"}}
						options={programs}
					/>
				</Form.Item>
				<Form.Item label="Orgunit">
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Please select"
                    allowClear
                    onChange={() => {}}
                    treeData={units}
                    />
				</Form.Item>
				<Form.Item label="Date Range">
                    <RangePicker />
				</Form.Item>
				<Form.Item>
					<Button type="primary">Search</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default MyApp;
