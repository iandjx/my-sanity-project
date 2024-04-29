import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const eventType = defineType({
	name: "event",
	title: "Event",
	type: "document",
	groups: [
		{ name: "details", title: "Details" },
		{ name: "editorial", title: "Editorial" },
	],
	fields: [
		defineField({
			name: "name",
			type: "string",
			group: "details",
		}),
		defineField({
			name: "eventType",
			type: "string",
			icon: CalendarIcon,
			options: {
				list: ["in-person", "virtual"],
				layout: "radio",
			},
			group: "details",
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: { source: "name" },
			hidden: ({ document }) => !document?.name,
			validation: (rule) =>
				rule.required().error("Required to generate a page on the website"),
			group: "details",
		}),
		defineField({
			name: "date",
			type: "datetime",
			group: "details",
		}),
		defineField({
			name: "doorsOpen",
			description: "Number of minutes before the start time for admission",
			type: "number",
			initialValue: 60,
			group: "details",
		}),
		defineField({
			name: "venue",
			type: "reference",
			to: [{ type: "venue" }],
			readOnly: ({ value, document }) =>
				!value && document?.eventType === "virtual",
			validation: (rule) =>
				rule.custom((value, context) => {
					if (value && context?.document?.eventType === "virtual") {
						return "Only in-person events can have a venue";
					}
					return true;
				}),
			group: "details",
		}),
		defineField({
			name: "headline",
			type: "reference",
			to: [{ type: "artist" }],
			group: "details",
		}),
		defineField({
			name: "image",
			type: "image",
			group: "editorial",
		}),
		defineField({
			name: "details",
			type: "array",
			of: [{ type: "block" }],
			group: "editorial",
		}),
		defineField({
			name: "tickets",
			type: "url",
			group: "details",
		}),
	],
	// After the "fields" array
	preview: {
		select: {
			title: "name",
			subtitle: "headline.name",
			media: "image",
		},
		prepare({ name, venue, artist, date, image }) {
			const nameFormatted = name || "Untitled event";
			const dateFormatted = date
				? new Date(date).toLocaleDateString(undefined, {
						month: "short",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
				  })
				: "No date";

			return {
				title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
				subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
				media: image || CalendarIcon,
			};
		},
	},
});
