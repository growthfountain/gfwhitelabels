const moment = require('moment');
const Views = require('./views.js');
const companyFees = require('consts/companyFees.json');

const inst = {};

describe('Investment page', () => {
  const mocks = {
    company: {
      data: {
        "linkedin": "https://linkedin.com/compny-beta/16185694/",
        "instagram": "",
        "total_views": 4483,
        "id": 925,
        "brief": "<p>“Understanding the laws governing medical marijuana and hemp is our core competency. Helping companies operating in this space thrive wholesomely is our business. Contributing to the settlement and prosperity of this new territory in American enterprise is our mission.”</p>",
        "zip_code": "72348",
        "is_approved": 6,
        "corporate_structure": 1,
        "campaign": {
          "gallery_group_id": 582,
          "perks": [
            {
              "perk": "THC Family T Shirt",
              "amount": 100
            }
          ],
          "additional_video": [],
          "percentage_revenue": 5,
          "id": 925,
          "amount_commited": 23200,
          "header_image_image_id": 5752,
          "header_image_data": {
            "id": 5752,
            "mime": "image/jpeg",
            "name": "OGMT9J0.jpg",
            "urls": {
              "main": "/7875e1ee72b1b42df4bb3ec569cbf5bd8590b533.jpg",
              "origin": "/da9e08d46892e0b13e86a776c6ba8632e8e1e2bf.jpg",
              "538x272": "/39033828f2b17d3250ad5b348c3f5ac0d4af56f2.jpg"
            },
            "site_id": 23
          },
          "cap": 2,
          "pitch": "Twenty-six states and the District of Columbia currently have laws broadly legalizing marijuana in some form. Three other states will soon join them after recently passing measures permitting use of medical marijuana. \r\n\r\nThese developments create a multitude of new opportunities—not only for businesses that produce, distribute, and sell marijuana, but also for those who provide services to these businesses, such as The Herbal Compliance, Co.  The Herbal Compliance. Co. has no direct interest in, or contact with marijuana, but provides legal guidance to businesses as a consulting service.\r\n\r\nWhile not assured, success for The Herbal Compliance, Co. does not require rocket science or an amazing twist of fortune: a group of competent, experienced, and enterprising businesspeople such as our team at The Herbal Compliance, Co. can chart a course to market share and profitability using solid principals and tested models. The marijuana business will soon produce many economic winners, and we are confident that we can be one of them.\r\n",
          "investor_presentation_data": {
            "id": 6150,
            "mime": "application/pdf",
            "name": "herbal_busplan.pdf",
            "urls": {
              "origin": "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/200ba9cc2a55b219d59e5685e4747ff3dc2eef18.pdf"
            },
            "site_id": 23
          },
          "minimum_increment": 100,
          "valuation_determination": 1,
          "faq": [
            {
              "answer": "No we do not work in the Dispensarys and Grow Houses.  Through our remote viewing systems we can accurately record all business transactions to comply with IRS deduction regulations and State inventory rules.\r\n\r\n",
              "question": "Do you work in Dispensarys or Grow Houses?"
            },
            {
              "answer": "We manage withholdings and pay payroll but we do not manage the employees. We will be glad to provide you with a list of managers who work directly with employees.\r\n\r\nWe are currently hiring for The Herbal Compliance, Co.  Please email your contact informationand a brief personal hustory to admin@herbalcompliance.com. ",
              "question": "Can you help me get a job in a Dispensary or Grow House?"
            },
            {
              "answer": "This crowdfunding round is for a Series A investment in The Herbal Compliance, Co. This is a growth stock, and may not pay dividends for an extendend period of time. In order to cash in profits, you will have to sell your shares of The Herbal Compliance, Co. stock. ",
              "question": "How do I get my money back?"
            }
          ],
          "expiration_date": "2017-10-04",
          "minimum_raise": 100000,
          "price_per_share": 5,
          "gallery_group_data": [
            {
              "id": 5729,
              "mime": "image/jpeg",
              "name": "shutterstock_487208470.jpg",
              "urls": {
                "main": "/537430dc864a34a50b27b86488a3801a31b66003.jpg",
                "origin": "/6f4a8ed5f53033b03017ebb6cddd0f9628da4ff9.jpg",
                "530x317": "/eea6fa56a4a9957f064fc34f7e0fa133e0ab581e.jpg"
              },
              "site_id": 23
            },
            {
              "id": 5732,
              "mime": "image/jpeg",
              "name": "shutterstock_534162313.jpg",
              "urls": {
                "main": "/e7dda3d5d2b0ddd3c282b897f4b3e9abb2a0b78a.jpg",
                "origin": "/44e4bdcccc402955aa438cb00d31d26e162d6787.jpg",
                "530x317": "/c56b967ba7e40b8a6ac4bff231d81f778994325d.jpg"
              },
              "site_id": 23
            },
            {
              "id": 5737,
              "mime": "image/jpeg",
              "name": "shutterstock_548148202.jpg",
              "urls": {
                "main": "/ba09d39c9dcfaef553e8b32637c7412df19fd536.jpg",
                "origin": "/703b635ef1f539944d76bd3190b7727940bfb0b6.jpg",
                "530x317": "/f98e68e5470c5f03d950e98ea7f2fd034fb9f1e2.jpg"
              },
              "site_id": 23
            },
            {
              "id": 5744,
              "mime": "image/jpeg",
              "name": "shutterstock_367707977.jpg",
              "urls": {
                "main": "/6bcb4bc7c3e259b7068448e8be14ca2c4d779f81.jpg",
                "origin": "/d908c574c6ac759cf32ba3fdb39f7aaec7b205b4.jpg",
                "530x317": "/c02dea2cee9e04d6c89f09b1ebac46555541d5e2.jpg"
              },
              "site_id": 23
            },
            {
              "id": 5747,
              "mime": "image/jpeg",
              "name": "shutterstock_457836619.jpg",
              "urls": {
                "main": "/5a54c3db9cc72732bd0f44d2bbd1dcbe47d64f22.jpg",
                "origin": "/eda967f7012b58e97c60db76a9359a5a31617d39.jpg",
                "530x317": "/34567a1de9485a3eef30579155d08c06d9656c47.jpg"
              },
              "site_id": 23
            }
          ],
          "intended_use_of_proceeds": "The services which The Herbal Compliance, Co. provides not only help customers maintain legal health, they also deliver measurable reductions in operating costs, and increases in revenue.  \r\nThe customer’s margin of profit is thus fattened, and The Herbal Compliance, Co. receives a portion of that profit gain as payment in the form of a monthly subscription fee. \r\n\r\n<u>Reductions in Operating Costs</u>\r\nFirst and foremost, The Herbal Compliance, Co. knows how to establish full legal compliance in its customers’ business processes. Many aspects of this compliance also have a positive influence on the cost of doing business.\r\n\r\n•\t<b>Tax:</b> The Herbal Compliance, Co. brings an abundant wealth of tax expertise to bear on its client’s behalf to establish simple best practices which can greatly reduce tax burdens\r\n•\t<b>Automation:</b> In achieving compliance, customers save by using our proprietary software system and remote data-capture hardware kit, instead of designing and implementing their own systems.\r\n\r\n<u>Increases in Revenue</u>\r\nAs we grow our industry expertise, we will acquire new competencies that can be applied to growing our customers’ businesses. These services will speed the process of expansion for our clients and result in revenue on a larger scale.\r\n\r\n•\tFinancing\r\n•\tFacility Design and Build-out\r\n•\tConsultation on Branding and Marketing\r\n•\tAccess to a Professional Network \r\n•\tBenefit from Vendor Partnerships\r\n\r\n",
          "length_days": 120,
          "additional_info": [],
          "list_image_data": {
            "id": 6919,
            "mime": "image/jpeg",
            "name": "5a54c3db9cc72732bd0f44d2bbd1dcbe47d64f22.jpg",
            "urls": {
              "main": "/1ad44ff5e0a15501e6e5dd266bcabeba2cfa0d42.jpg",
              "origin": "/83dda0201112700849e91d5b4e9e0292db9b4942.jpg",
              "350x209": "/1ad44ff5e0a15501e6e5dd266bcabeba2cfa0d42.jpg"
            },
            "site_id": 23
          },
          "maximum_raise": 1000000,
          "team_members": [
            {
              "bio": "Chuck is an Ole Miss graduate with a major in Law. He is an entrepreneur with 45 years of experience. He created private pensions working directly with the IRS through private letter rulings. Carpenter then directly managed the pension funds and often invested in businesses that needed capital or management experience. Thus, he has been successful in many industries.",
              "city": "Horseshoe Lake",
              "email": "cc@herbalcompliance.com",
              "order": 1,
              "title": "President - Legal",
              "college": "Ole Miss",
              "facebook": "",
              "linkedin": "",
              "last_name": "Carpenter",
              "first_name": "Chuck ",
              "photo_data": {
                "id": 5605,
                "mime": "image/jpeg",
                "name": "Chuck Photo.jpg",
                "urls": {
                  "main": "/60356644d31824f3221b3bfa03ff85d4e5cdfda0.jpg",
                  "origin": "/8e5af81f4d1af993dd44b117b0180b9cf343fd2b.jpg",
                  "300x300": "/4d2f47a84531b8c98bb5792f3f23b37f02ac670d.jpg"
                },
                "site_id": 18
              },
              "photo_image_id": 5605
            },
            {
              "bio": "Bart, a successful entrepreneur, owns and operates a thriving consulting business in the property and sales industry. As a founder of The Herbal Compliance, Co., he is responsible for following emerging markets, enterprise development, and managing client relationships. Bart is an Air Force veteran with 20+ years of experience in the operations side of the health care industry as well as 5+ years spent consulting on property inspection and restoration. His ability to understand client challenges and quickly develop and implement successful solutions is one of his greatest strengths.",
              "city": "",
              "email": "bh@herbalcompliance.com",
              "order": 2,
              "title": "Vice President - State/ Federal Compliance",
              "college": "",
              "facebook": "",
              "linkedin": "",
              "last_name": "Hamilton",
              "first_name": "Bart",
              "photo_data": {
                "id": 5478,
                "mime": "image/jpeg",
                "name": "Bart Pic.jpg",
                "urls": {
                  "main": "/b0540bb667a8c951c74e4c4e40a1d08aeea68952.jpg",
                  "origin": "/71501fc34dba200b42bcd35577ab5408fd901c0c.jpg",
                  "300x300": "/9b94e138e42c9097ee65adf6d284863f3f14ec0a.jpg"
                },
                "site_id": 23
              },
              "photo_image_id": 5478
            },
            {
              "bio": "Brian is a successful entrepreneur who owns a thriving insurance agency with one of the top three insurance carriers in the industry. He also has one start-up to his credit, developing an exciting new idea for mobile vehicle maintenance. Brian has an extensive background in sales, operations, and account management, with over 20 years of experience. As a founder of The Herbal Compliance, Co. his talents will be focused on developing and maintaining client relationships, marketing, and sales.",
              "city": "Chattanooga, TN",
              "email": "bg@herbalCompliance.com",
              "order": 3,
              "title": "Vice President - Insurance/Investments",
              "college": "Chattanooga State",
              "facebook": "https://facebook.com/brian.gass.75",
              "linkedin": "",
              "last_name": "Gass",
              "first_name": "Brian",
              "photo_data": {
                "id": 5618,
                "mime": "image/jpeg",
                "name": "Brian Pic.JPG",
                "urls": {
                  "main": "/50aa0ccb0c1a1b5dab35ff8f759b0b9093a3532b.JPG",
                  "origin": "/e28c0c63a17b0e6a9d390b2fd79b0960021570ed.JPG",
                  "300x300": "/83b7d044b4f5e4af81bef246cb6f3337fbdc05aa.JPG"
                },
                "site_id": 18
              },
              "photo_image_id": 5618
            },
            {
              "bio": "Whitney is passionate and results driven, with over a decade of experience focused on full life cycle recruiting, sales, social media marketing, and account management. With an entrepreneurial spirit, Whitney has helped many thriving start-up businesses.  Whitney can assist with recruiting the employees, coaching business owners as their businesses grow and prosper, and her detailed nature makes her integral for compliance work. As a founder of The Herbal Compliance, Co. her concentration will be sales, social media and data management, and secretarial duties at Board of Directors meetings. ",
              "city": "Memphis, TN",
              "email": "wg@herbalcompliance.com",
              "order": 5,
              "title": " Corporate Secretary",
              "college": "UT Chattanooga, TN",
              "facebook": "",
              "linkedin": "",
              "last_name": "Gass",
              "first_name": "Whitney",
              "photo_data": {
                "id": 5522,
                "mime": "image/jpeg",
                "name": "Whit Pic.JPG",
                "urls": {
                  "main": "/b056ea2e62d2c025c44bbd41c2daa1cd396c75f8.JPG",
                  "origin": "/50215a1cd3db9c9da40de2291605392323522200.JPG",
                  "300x300": "/68d7b158a06c15fd0b34e38065fecd3b726aef07.JPG"
                },
                "site_id": 23
              },
              "photo_image_id": 5522
            },
            {
              "bio": "Steven M. Smith attended The University of MS School of Pharmacy from 1988-1990 before purchasing a small restaurant that he had worked at from the age of eleven.  After selling the restaurant, Steve became an Investment Advisor for Edwards Jones and then entered the Insurance field, where he still works.  Steve graduated Magna Cum Laude with a Bachelor’s Degree in Management from Victory University in Memphis, TN.  ",
              "city": "",
              "email": "sn@herbalcompliance.com",
              "order": 6,
              "title": "Vice President - Research and Developmemt",
              "college": "",
              "facebook": "",
              "linkedin": "",
              "last_name": "Smith",
              "first_name": "Steven ",
              "photo_data": {
                "id": 5540,
                "mime": "image/jpeg",
                "name": "Steve Smith Pic.jpg",
                "urls": {
                  "main": "/176b5586d2d5a6aaa9012cec74e975979d6f253e.jpg",
                  "origin": "/cf277747767e6f6c7eac85809b614f11b12e24a2.jpg",
                  "300x300": "/92ecfe7cc458e436d298ffd8b6a95296c163641b.jpg"
                },
                "site_id": 23
              },
              "photo_image_id": 5540
            },
            {
              "bio": "Lisa Smith, a litigation/trial paralegal, obtained her paralegal certification from Auburn University.  Lisa has over 15 years of  professional legal experience and has worked for some the most prestigious law firms in Memphis, TN.",
              "city": "",
              "email": "ls@herbalcompliance.com",
              "order": 6,
              "title": "Advisor-Legal",
              "college": "Auburn University",
              "facebook": "",
              "linkedin": "",
              "last_name": "Smith",
              "first_name": "Lisa ",
              "photo_data": {
                "id": 5623,
                "mime": "image/jpeg",
                "name": "Lisa Smith Pic.jpg",
                "urls": {
                  "main": "/22a7892322ede0777dcfd7653c34e4b212b577a1.jpg",
                  "origin": "/013e9e6516a321e920e9e14609d22c5b66664b51.jpg",
                  "300x300": "/06ab152c7d3ba4894da507b947a8a0c84c8dca7b.jpg"
                },
                "site_id": 18
              },
              "photo_image_id": 5623
            },
            {
              "bio": "Clifford Adam Smith is a 1989 of Mississippi State University with a Bachelor’s Degree in Chemical Engineering. Adam has worked with the State of MS Department of Environmental Quality for over 27 years.  He has also achieved the Professional Engineer License.  \r\n\r\n",
              "city": "",
              "email": "as@herbalcompliance.com",
              "order": 7,
              "title": "Advisor - Chemical Engineering",
              "college": "MS State",
              "facebook": "",
              "linkedin": "",
              "last_name": "Smith",
              "first_name": "Adam",
              "photo_data": {
                "id": 5661,
                "mime": "image/jpeg",
                "name": "AdamSmith1.JPG",
                "urls": {
                  "main": "/699730ebea588599235b4235ecb2ab40759e3376.JPG",
                  "origin": "/fe551449a78af3c65e5bf8030354db5e5806ce8f.JPG",
                  "300x300": "/699730ebea588599235b4235ecb2ab40759e3376.JPG"
                },
                "site_id": 23
              },
              "photo_image_id": 5661
            },
            {
              "bio": "One of the founders, Val has been a professional in health care for nearly two decades. She has held positions with one of the nation’s largest health insurers and was an integral leader of a start-up team for a health care CO-OP. She is currently a managed care contracting director in the health care industry for a Fortune 500 company.\r\nVal has expertise in guiding medical professionals through the networks & contracting arm of the health care industry’s operational aspects, delivering guidance and leadership on:\r\n·         Managed Care \r\n·         Client Relations\r\n·         Contract Negotiation\r\n·         Vendor Management\r\n·         Project Management\r\n·         Education/Training\r\n·         Marketing/Sales\r\n·         Regulatory Compliance \r\n·         Alternative Healing\r\nVal holds a Bachelor of Science in Psychology as well as a designation with the Professional Academy for Healthcare Management.\r\nShe most recently completed a year-long immersion with a Healing Wise group studying alternative healing remedies, wellness, and mindfulness practices. She is enthusiastic to witness the acceptance of cannabis into the health care industry as a revolutionary and therapeutic medicinal option. She is wholeheartedly ready to help clients navigate the industry with The Herbal Compliance Company.\r\n \r\n\r\n",
              "city": "",
              "email": "vh@herbalcompliance.com",
              "order": 8,
              "title": "Advisor- Medical Compliance",
              "college": "",
              "facebook": "",
              "linkedin": "",
              "last_name": "Hamilton",
              "first_name": "Val",
              "photo_data": {
                "id": 5638,
                "mime": "image/jpeg",
                "name": "Val Pic.jpg",
                "urls": {
                  "main": "/45375ee411b02117b9e9566612f774d7815c610b.jpg",
                  "origin": "/86fc1d349b56ed7d530c3f3aa6ce6c73c0b16952.jpg",
                  "300x300": "/5077aebf9e9fb4de1f72e9d8bc5339aa45219777.jpg"
                },
                "site_id": 18
              },
              "photo_image_id": 5638
            },
            {
              "bio": "University of Tennessee at Nashville                                          \r\nWester Michigan Michigan University\r\n\r\nAssociate of Arts in Nursing with honors, May 1977                \r\nBachelor of Arts, Social Work 1972\r\n                                                                        \r\nAfter graduating from Nursing school in 1977, I remained gainfully employed for 37 years.  My experience was varied – Medical, Surgical, Psychiatric, Home Health, OB/GYN, Nursery, Neonatal Intensive Care (my favorite).  My last employment was at Trigg County Hospital as Nurse Manager of MedSurg.  I was office manager (2000-03) in a fast paced Internal Medicine office (Antioch Medical Associates, Nashville) with 2 providers.  \r\n \r\nI am a Licensed Registered Nurse in Kentucky with multistate privileges in compact states (license# 1129459); Never any sanctions.  \r\n",
              "city": "",
              "email": "mcneen7@aol.com",
              "order": null,
              "title": "Medical Professional",
              "college": "",
              "facebook": "",
              "linkedin": "",
              "last_name": "McDonald ",
              "first_name": "Anita",
              "photo_data": {
                "id": 6439,
                "mime": "image/jpeg",
                "name": "anita for THC.jpg",
                "urls": {
                  "main": "/916b4124daa861d08cacd505279775b16a21aa3a.jpg",
                  "origin": "/72163b7d936a2348bc659ec9126b3db852000c38.jpg",
                  "300x300": "/916b4124daa861d08cacd505279775b16a21aa3a.jpg"
                },
                "site_id": 23
              },
              "photo_image_id": 6439
            }
          ],
          "valuation_determination_other": "",
          "investor_presentation_file_id": 6150,
          "premoney_valuation": 3054000,
          "list_image_image_id": 6919,
          "business_model": "All industries face compliance issues.  The Medical Marijuana industry faces all the issues compliant industries face but they also face the conflicts between state and federal laws. Our Compliance based systems are in great demand.\r\n\r\nWe need to raise capital to position ourselves in this industry as one of the leaders. It is important to be one of the first in and one of the few who are adequately funded.\r\n\r\nPLEASE SEE FORM C USE OF PROCEEDS FOR DETAILS.\r\n\r\n",
          "amount_raised": 54105,
          "security_type": 0,
          "site_id": 23,
          "video": "https://www.youtube.com/watch?v=emd3NrFomXQ",
          "press": []
        },
        "twitter": "https://twitter.com/TheHC_Co",
        "ga_id": "1234567890",
        "industry": 8,
        "owner_id": 1158,
        "address_1": "281 Lakewood Dr.",
        "description": "The Herbal Compliance, Co. provides companies in the legal Medical Cannabis and Hemp business with services to ensure that they remain compliant with the law. \r\n\r\nLegalization of marijuana at the state level has been sweeping across the nation in recent years, but federal law hasn’t changed much to date. As a result, the many new startups and small businesses operating in the medical marijuana and hemp space are faced with navigating literally thousands of conflicts between state and federal regulations. \r\n\r\nThis is a major pain point for the industry, and it comes to bear on each individual operator on top of the challenges of running a young business in a new and uncharted marketplace. Understanding, tracking, and ensuring compliance with state and federal laws is too much for individual operators to handle alone. \r\n\r\nEnter the Herbal Compliance, Co. Understanding the laws governing medical marijuana and hemp is our core competency. Helping companies operating in this space thrive wholesomely is our business. Contributing to the settlement and prosperity of this new territory in American enterprise is our mission.\r\n\r\n",
        "formc": {
          "fiscal_prior_group_data": [],
          "fiscal_recent_group_data": [
            {
              "id": 5719,
              "mime": "application/pdf",
              "name": "04.30.2017 Reviewed Financials_issued May 1, 2017.pdf",
              "urls": {
                "origin": "/d0ea02d54812487e5e4a6b6e4d0638207d3e2628.pdf"
              },
              "site_id": 23
            }
          ],
          "link_to_formc": "https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001705517&owner=exclude&action=getcompany&Find=Search"
        },
        "address_2": "",
        "city": "Horseshoe Lake",
        "owner": {
          "last_name": "Carpenter",
          "email": "cc@herbalcompliance.com",
          "first_name": "Chuck"
        },
        "slug": "herbal-compliance",
        "founding_state": "AR",
        "founding_date": "2017-01-26",
        "tagline": "Expertise for a budding industry",
        "website": "http://herbalcompliance.com",
        "short_name": "Herbal Compliance",
        "name": "The Herbal Compliance, Co.",
        "facebook": "https://facebook.com/HerbalCompliance/",
        "state": "AR"
      },
    },
    investment: {
      fields: {
        "is_understand_securities_related": {
          "type": "boolean",
          "validate": {
            "_OneOf": "OneOf"
          },
          "required": true
        },
        "amount": {
          "type": "decimal",
          "validate": {},
          "required": true
        },
        "company_id": {
          "type": "integer",
          "validate": {},
          "required": true
        },
        "payment_information_type": {
          "type": "integer",
          "validate": {},
          "required": true
        },
        "payment_information_data": {
          "type": "nested",
          "validate": {},
          "required": true,
          "schema": {
            "name_on_bank_account": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "account_number": {
              "type": "crypt",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "bank_account_type": {
              "type": "boolean",
              "validate": {},
              "required": true
            },
            "credit": {
              "type": "decimal",
              "validate": {},
              "required": false
            },
            "account_number_fake": {
              "type": "string",
              "validate": {},
              "required": false
            },
            "routing_number_fake": {
              "type": "string",
              "validate": {},
              "required": false
            },
            "routing_number": {
              "type": "crypt",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            }
          }
        },
        "is_understand_investing_is_risky": {
          "type": "boolean",
          "validate": {
            "_OneOf": "OneOf"
          },
          "required": true
        },
        "personal_information_data": {
          "type": "nested",
          "validate": {},
          "required": true,
          "schema": {
            "first_name": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "phone": {
              "type": "string",
              "validate": {},
              "required": false
            },
            "country": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "city": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "zip_code": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "street_address_1": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "state": {
              "type": "string",
              "validate": {},
              "required": false
            },
            "last_name": {
              "type": "string",
              "validate": {
                "_Length": "Length"
              },
              "required": true
            },
            "street_address_2": {
              "type": "string",
              "validate": {},
              "required": false
            }
          }
        },
        "is_understand_restrictions_to_cancel_investment": {
          "type": "boolean",
          "validate": {
            "_OneOf": "OneOf"
          },
          "required": true
        },
        "is_understand_difficult_to_resell_purchashed": {
          "type": "boolean",
          "validate": {
            "_OneOf": "OneOf"
          },
          "required": true
        },
        "is_reviewed_educational_material": {
          "type": "boolean",
          "validate": {
            "_OneOf": "OneOf"
          },
          "required": true
        }
      },
    },
    user: {
      data: {
        "accredited_investor_poor": true,
        "bank_name": "Privat",
        "first_name": "Vladimir",
        "invested_on_other_sites": 0,
        "linkedin": "",
        "account_number": "*****6789",
        "phone": "12345678",
        "name_on_bank_account": "Vladimir Chagin",
        "accredited_investor_5m": true,
        "net_worth": 1076,
        "zip_code": "03194",
        "email": "vladimir.chagin@gmail.com",
        "id": 176,
        "routing_number": "*****6789",
        "accredited_investor_choice": true,
        "instagram": "",
        "ssn": "*****6789",
        "twitter": "",
        "accredited_investor_200k": true,
        "annual_income": 219,
        "facebook": "",
        "last_name": "Chagin",
        "invested_equity_past_year": 0,
        "city": "03330 Naves",
        "street_address_2": "",
        "image_image_id": 5643,
        "country": "US",
        "state": "",
        "bank_account_type": false,
        "street_address_1": "Koltsova blvd 14d",
        "accredited_investor_1m": true,
        "image_data": {
          "id": 5643,
          "urls": {
            "main": "/faab8d1c62771c9c39b855f4d4c07517b65eb8a7.png",
            "50x50": "/302ede188b480c5e6e2228c6efe4d36ecf227237.png",
            "origin": "/d31369f05ff8ca88c3239f940c1ed76df1a8514f.png"
          },
          "name": "ava.png",
          "site_id": 23,
          "mime": "image/png"
        },
        "credit": 0,
        "days_left": 0,
        "info": [
          {
            "company_id": 941,
            "campaign_id": 941,
            "formc_id": 941,
            "owner_id": 176,
            "user_id": 176,
            "is_paid": false,
            "company": "MAC",
            "role": 0
          }
        ]
      },
    },
  };

  before(() => {
    Object.assign(app.user.data, mocks.user.data);
  });

  after(() => {

  });

  beforeEach(() => {
    testHelpers.stubMakeRequest({});
    app.analytics.emitCompanyCustomEvent = sinon.stub(app.analytics, 'emitCompanyCustomEvent');
    const companyData = JSON.parse(JSON.stringify(mocks.company.data));
    inst.View = new Views.investment({
      model: new app.models.Company(companyData, mocks.investment.fields),
      user: mocks.user.data,
      fields: Object.assign({}, mocks.investment.fields),
    });
    inst.View.render();
  });

  afterEach(() => {
    inst.View.undelegateEvents();
    $('#content').empty();
    delete inst.View;
    app.analytics.emitCompanyCustomEvent.restore();
    api.makeRequest.restore();
  });

  it('emitCompanyCustomEvent', () => {
    expect(app.analytics.emitCompanyCustomEvent.called).to.equal(true);
    expect(app.analytics.emitCompanyCustomEvent.args[0][0]).to.equal(mocks.company.data.ga_id);
  });

  describe('calcFeeWithCredit', () => {
    it('credit > fee', () => {
      inst.View.user.credit = 15;
      const res = inst.View.calcFeeWithCredit();
      expect(res).to.deep.equal({
        waived: companyFees.fees_to_investor,
        fee: 0,
        remainingCredit: 5,
        credit: 15,
      });
    });

    it('credit <= 0', () => {
      inst.View.user.credit = 0;
      const res = inst.View.calcFeeWithCredit();
      expect(res).to.deep.equal({
        waived: 0,
        fee: companyFees.fees_to_investor,
        remainingCredit: 0,
        credit: 0,
      });
    });

    it('credit === fee', () => {
      inst.View.user.credit = companyFees.fees_to_investor;
      const res = inst.View.calcFeeWithCredit();
      expect(res).to.deep.equal({
        waived: companyFees.fees_to_investor,
        fee: 0,
        remainingCredit: 0,
        credit: companyFees.fees_to_investor,
      });
    });

    it('credit < fee', () => {
      inst.View.user.credit = companyFees.fees_to_investor - Math.round(companyFees.fees_to_investor / 2);
      const res = inst.View.calcFeeWithCredit();
      expect(res).to.deep.equal({
        waived: companyFees.fees_to_investor,
        fee: companyFees.fees_to_investor - inst.View.user.credit,
        remainingCredit: 0,
        credit: inst.View.user.credit,
      });
    });
  });

  it('initMaxAllowedAmount positive', () => {
    const user = inst.View.user;
    user.annual_income = 110;
    user.net_worth = 100;
    user.invested_on_other_sites = 1000;
    user.invested_equity_past_year = 5000;

    inst.View.initMaxAllowedAmount();
    expect(inst.View._maxAllowedAmount).to.equal(4000);
  });

  it('initMaxAllowedAmount zero', () => {
    const user = inst.View.user;
    user.annual_income = 110;
    user.net_worth = 10;
    user.invested_on_other_sites = 1000;
    user.invested_equity_past_year = 5000;

    inst.View.initMaxAllowedAmount();
    expect(inst.View._maxAllowedAmount).to.equal(0);
  });

  it('validateAmount: amount valid', () => {
    const user = inst.View.user;
    user.annual_income = 110;
    user.net_worth = 100;
    user.invested_on_other_sites = 1000;
    user.invested_equity_past_year = 5000;

    inst.View.initMaxAllowedAmount();
    expect(inst.View.validateAmount(2000)).to.equal(true);
  });

  it('validateAmount: amount invalid', () => {
    const user = inst.View.user;
    user.annual_income = 110;
    user.net_worth = 100;
    user.invested_on_other_sites = 1000;
    user.invested_equity_past_year = 5000;

    inst.View.initMaxAllowedAmount();
    expect(inst.View.validateAmount(5000)).to.equal(false);
  });

  describe('render', () => {

    it('expired campaign', () => {
      inst.View.model.campaign.data.expiration_date = moment().subtract(1, 'years').format('YYYY-MM-DD');
      inst.View.render();
      expect(inst.View.$el.find('img[alt="campaign expired"]').length).to.equal(1);
    });

    it('active campaign', () => {
      inst.View.model.campaign.data.expiration_date = moment().add(1, 'years').format('YYYY-MM-DD');
      inst.View.render();
      expect(inst.View.$el.find('#investForm').length).to.equal(1);
    });

  });

  it('function validation message', () => {
    const min = 100;
    const max = 5000;
    inst.View.model.campaign.minimum_increment = min;
    inst.View._maxAllowedAmount = max;

    const validateMin = () => {
      return inst.View.fields.amount.fn('amount', 99);
    };

    const validateMax = () => {
      return inst.View.fields.amount.fn('amount', 50001);
    };

    const validateOK = () => {
      return inst.View.fields.amount.fn('amount', 2000);
    };

    expect(validateMin).to.throw('Sorry, minimum investment is $' + min);
    expect(validateMax).to.throw('Sorry, your amount is too high, please update your income or change amount');
    expect(validateOK()).to.equal(true);
  });

  it('roundAmount', () => {
    const amount = 1000;
    const formattedAmount = app.helpers.format.formatMoney(amount);
    const $amount = inst.View.$('#amount');

    $amount.val(amount).trigger('keyup');

    inst.View.model.security_type = 1;
    $amount.trigger('change');
    expect($amount.val()).to.equal(formattedAmount);

    inst.View.model.security_type = 0;
    inst.View.model.campaign.price_per_share = 2.75;

    $amount.trigger('change');
    expect($amount.val()).to.equal(app.helpers.format.formatMoney(1001));
  });

  it('updateIncomeWorth', () => {
    const annual_income = 110000;
    const net_worth = 100000;

    inst.View.user.invested_on_other_sites = 1000;
    inst.View.user.invested_equity_past_year = 5000;

    inst.View.$('#annual_income').val(annual_income).trigger('keyup');
    inst.View.$('#net_worth').val(net_worth).trigger('keyup');

  });

  it('разработься с triggerAmountChange', () => {

  });

  it('updateIncomeWorth', () => {
    const annual_income = 110000;
    const net_worth = 100000;

    inst.View.user.invested_on_other_sites = 1000;
    inst.View.user.invested_equity_past_year = 5000;

    inst.View.$('#annual_income').val(annual_income).trigger('keyup');
    inst.View.$('#net_worth').val(net_worth).trigger('keyup');

    //TODO: implement
  });

  describe('submit', () => {
    beforeEach(() => {
      api.submitAction = sinon.stub(api, 'submitAction');
    });
    afterEach(() => {
      api.submitAction.restore();
    });

    it('submit payment_information_type 1', () => {
      inst.View.$('[name=payment_information_type]').val(1);

      inst.View.$('#submitButton').click();
      // expect(api.submitAction.called).to.equal(true);
      expect(inst.View.fields.payment_information_data).to.be.undefined;
      expect(api.submitAction.called).to.equal(true);
    });

    it('submit payment_information_type 2', () => {
      inst.View.$('[name=payment_information_type]').val(2);

      inst.View.$('#submitButton').click();
      // expect(api.submitAction.called).to.equal(true);
      expect(inst.View.fields.payment_information_data).to.be.undefined;
      expect(api.submitAction.called).to.equal(true);
    });

    it('submit payment_information_type default', () => {
      inst.View.$('#submitButton').click();
      // expect(api.submitAction.called).to.equal(true);
      expect(inst.View.fields.payment_information_data).not.to.be.undefined;
      expect(api.submitAction.called).to.equal(true);
    });

  });

  describe('updateIncomeWorth', () => {
    beforeEach(() => {
      $('#income_worth_modal').find('.submit-income-worth').on('click', inst.View.updateIncomeWorth.bind(inst.View));
    });

    afterEach(() => {
      $('#income_worth_modal').find('.submit-income-worth').off('click');
    });

    it('required validation', () => {
      $('#net_worth').val('');
      $('#annual_income').val('');

      let $networthModal = $('#income_worth_modal');
      let $submitButton = $networthModal.find('.submit-income-worth');
      $submitButton.on('click', inst.View.updateIncomeWorth.bind(inst.View));
      expect(api.makeRequest.called).to.equal(false);
    });

    it('valid data saved on server', () => {
      $('#net_worth').val('12345');
      $('#annual_income').val('12345');

      if (api.makeRequest.restore)
        api.makeRequest.restore();

      testHelpers.stubMakeRequest({
        annual_income: 123456,
        net_worth: 1234579,
      });

      let $networthModal = $('#income_worth_modal');
      let $submitButton = $networthModal.find('.submit-income-worth');
      $submitButton.on('click', inst.View.updateIncomeWorth.bind(inst.View));
      $submitButton.click();

      expect(api.makeRequest.called).to.equal(true);

      expect($('span.current-limit').text()).to.equal(inst.View._maxAllowedAmount.toLocaleString('en-US'));
      expect(inst.View.$amount.data('max')).to.equal(inst.View._maxAllowedAmount);
    });

    // посмотреть, покрыть тестами что возможно
  });

  describe('saveEsign', () => {
    const model = {"address_2":"Test Optional Address 1","city":"Test City 221","formc":{"fiscal_recent_group_data":[{"id":7474,"mime":"application/xml","name":"bank_statement.xml","urls":{"origin":"http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com/250796e5e9c4f27a721c45abd09b0294df7658c2.xml"}},{"id":7475,"mime":"application/xml","name":"bank_summary.xml","urls":{"origin":"http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com/e61b1b87ba38eb194ca03572a411681e472af136.xml"}}],"fiscal_prior_group_data":[{"id":7473,"mime":"application/pdf","name":"Scrum Guide.pdf","urls":{"origin":"/6bc236a9a66d93725d852e2cee58b9d5850b13d6.pdf"},"site_id":12}],"link_to_formc":"http://www.dlink.ru/"},"id":908,"total_views":409,"founding_state":"CA","facebook":"https://facebook.com/revenueshare","state":"FL","description":"111\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.","approved_date":"2017-07-26T14:42:46.319692+00:00","twitter":"https://twitter.com/revenueshare","ga_id":"UA-97185485-4","founding_date":"1988-01-01","owner":{"first_name":"Ratmir","email":"ratmir.asanov.1@yandex.ru","last_name":"Asanov"},"website":"https://website1.com","brief":"- Some text information. <br />\r\n- Some text information. <br />\r\n- Some text information. <br />","address_1":"Test Street Address 1","short_name":"Revenue Share Company (Ratmir) 1","slug":"test-legal-revenue-share-company-ratmir-1","name":"Test Legal Revenue Share Company (Ratmir) 1","owner_id":1077,"corporate_structure":1,"tagline":"Test Tagline 1","zip_code":"15003","is_approved":6,"linkedin":"https://linkedin.com/revenueshare","instagram":"https://instagram.com/revenueshare","industry":6,"campaign":{"security_type":1,"percentage_revenue":5,"site_id":23,"id":908,"amount_commited":0,"minimum_increment":500,"investor_presentation_file_id":4396,"length_days":60,"gallery_group_data":[{"id":4185,"mime":"image/jpeg","name":"Gallery 1_1.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/52057dfb9e28d21aa1aaf69232b9d1d9b9b795b3.jpg"}},{"id":4187,"mime":"image/jpeg","name":"Gallery 1_2.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/d2d7ce01aa5af0c12fc146b2223be2bab4667440.jpg"}},{"id":4189,"mime":"image/jpeg","name":"Gallery 1_3.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/a9f25238661d130b295bc22cdefd9a88c89178f6.jpg"}},{"id":4191,"mime":"image/jpeg","name":"Gallery 1_4.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/8dadc3e207721234155fc8ebeb35716bbd0ee055.jpg"}},{"id":4193,"mime":"image/jpeg","name":"Gallery 1_5.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/3a67a5da068f8ff0de64d41d3b284da2572f3c4a.jpg"}},{"id":4195,"mime":"image/jpeg","name":"Gallery 1_6.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/64b0ddfc79b0fb5a9e3536b43bce8219983053c1.jpg"}},{"id":4197,"mime":"image/jpeg","name":"Gallery 1_7.jpg","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/fae679d4ef17101ee50748be5d15569f307b8f91.jpg"}}],"investor_presentation_data":{"id":4396,"mime":"application/msword","name":"Монах, который продал свой Феррари -- Робин Шарма.doc","urls":{"origin":"http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/a4756f61615009a05ea6bcec6e039de950dca3f1.doc"},"site_id":23},"premoney_valuation":10000000,"gallery_group_id":531,"expiration_date":"2017-08-20T00:00:00.000Z","press":[{"link":"https://en.wikipedia.org/wiki/Test_article","headline":"Test Headline 1"},{"link":"http://www.hopkinsmedicine.org/institutional_review_board/guidelines_policies/guidelines/fda_test_articles.html","headline":"Test Headline 2"}],"maximum_raise":1000000,"list_image_data":[{"id":4184,"mime":"image/jpeg","name":"Thumbnail 1350x209.jpg","urls":["http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/f5eff423133e6872f1b819197620456908d5954d.jpg"]},{"id":4182,"mime":"image/jpeg","name":"Thumbnail 1.jpg","urls":["http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/bd7b421ac4ed06b82c849a2d7601f5681b1f587e.jpg"]}],"valuation_determination_other":"","valuation_determination":0,"pitch":"Why Should People Invest? 1","faq":[{"answer":"Some text answer. Some text answer. Some text answer. Some text answer. Some text answer. Some text answer. Some text answer.","question":"Test Question 1"},{"answer":"Some text answer. Some text answer. Some text answer. Some text answer. Some text answer. Some text answer. Some text answer.","question":"Test Question 1"}],"additional_video":[{"link":"https://www.youtube.com/watch?v=isaXqowHZuU","headline":"Test Additional Video for Campaign 1"},{"link":"https://vimeo.com/212891518","headline":"Test Additional Video for Campaign 2"}],"business_model":"Why We Are Raising Capital? 1","perks":[{"perk":"Test Describe the Perk 1","amount":1000},{"perk":"Test Describe the Perk 2","amount":11000}],"team_members":[{"bio":"Some text information.\r\nSome text information.\r\nSome text information.\r\nSome text information.\r\nSome text information.\r\nSome text information.\r\nSome text information.","city":"London","email":"ratmir.asanov.1@yandex.ru","order":1,"title":"Senior","college":"Some College","facebook":"","linkedin":"","last_name":"Test Last Name 1","first_name":"Test First Name 1","photo_data":{"id":4201,"urls":{"origin":"/c509986367279f6c202706674d3449aea0aff3c0.jpg","300x300":"/aec503ea4dcc0d625d1a471c8acc28e5620ac684.jpg"},"site_id":23},"photo_image_id":4201}],"intended_use_of_proceeds":"How We Intend To Make Money? 1","additional_info":[{"body":"Some text description. Some text description. Some text description. Some text description. Some text description. Some text description. Some text description.","title":"Test Title 1"},{"body":"Some text description. Some text description. Some text description. Some text description. Some text description. Some text description. Some text description.","title":"Test Title 2"}],"price_per_share":50.61,"amount_raised":29235,"video":"https://www.youtube.com/watch?v=qowIBnTXE3Q","minimum_raise":50000,"cap":2,"header_image_data":[{"id":4178,"mime":"image/jpeg","name":"Header 11597x958.jpg","urls":["http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/6ab03f175cf8f0cf311ef0ba32d07d738b191309.jpg"]},{"id":4176,"mime":"image/jpeg","name":"Header 1.jpg","urls":["http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/c42ab5ce49de72415054cdbb8b4b7cf9b490763a.jpg"]}]}};
    const fields = {
      "is_understand_securities_related": {
        "type": "boolean",
        "validate": {
          "_OneOf": "OneOf"
        },
        "required": true
      },
      "amount": {
        "type": "decimal",
        "validate": {},
        "required": true
      },
      "company_id": {
        "type": "integer",
        "validate": {},
        "required": true
      },
      "payment_information_type": {
        "type": "integer",
        "validate": {},
        "required": true
      },
      "payment_information_data": {
        "type": "nested",
        "validate": {},
        "required": true,
        "schema": {
          "name_on_bank_account": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "account_number": {
            "type": "crypt",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "bank_account_type": {
            "type": "boolean",
            "validate": {},
            "required": true
          },
          "credit": {
            "type": "decimal",
            "validate": {},
            "required": false
          },
          "account_number_fake": {
            "type": "string",
            "validate": {},
            "required": false
          },
          "routing_number_fake": {
            "type": "string",
            "validate": {},
            "required": false
          },
          "routing_number": {
            "type": "crypt",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          }
        }
      },
      "is_understand_investing_is_risky": {
        "type": "boolean",
        "validate": {
          "_OneOf": "OneOf"
        },
        "required": true
      },
      "personal_information_data": {
        "type": "nested",
        "validate": {},
        "required": true,
        "schema": {
          "first_name": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "phone": {
            "type": "string",
            "validate": {},
            "required": false
          },
          "country": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "city": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "zip_code": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "street_address_1": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "state": {
            "type": "string",
            "validate": {},
            "required": false
          },
          "last_name": {
            "type": "string",
            "validate": {
              "_Length": "Length"
            },
            "required": true
          },
          "street_address_2": {
            "type": "string",
            "validate": {},
            "required": false
          }
        }
      },
      "is_understand_restrictions_to_cancel_investment": {
        "type": "boolean",
        "validate": {
          "_OneOf": "OneOf"
        },
        "required": true
      },
      "is_understand_difficult_to_resell_purchashed": {
        "type": "boolean",
        "validate": {
          "_OneOf": "OneOf"
        },
        "required": true
      },
      "is_reviewed_educational_material": {
        "type": "boolean",
        "validate": {
          "_OneOf": "OneOf"
        },
        "required": true
      }
    };
    const userData = {
      "accredited_investor_poor": true,
      "bank_name": "Privat",
      "first_name": "Vladimir",
      "invested_on_other_sites": 0,
      "linkedin": "",
      "account_number": "*****6789",
      "phone": "12345678",
      "name_on_bank_account": "Vladimir Chagin",
      "accredited_investor_5m": true,
      "net_worth": 1076,
      "zip_code": "03194",
      "email": "vladimir.chagin@gmail.com",
      "id": 176,
      "routing_number": "*****6789",
      "accredited_investor_choice": true,
      "instagram": "",
      "ssn": "*****6789",
      "twitter": "",
      "accredited_investor_200k": true,
      "annual_income": 219,
      "facebook": "",
      "last_name": "Chagin",
      "invested_equity_past_year": 0,
      "city": "03330 Naves",
      "street_address_2": "",
      "image_image_id": 5643,
      "country": "US",
      "state": "",
      "bank_account_type": false,
      "street_address_1": "Koltsova blvd 14d",
      "accredited_investor_1m": true,
      "image_data": {
        "id": 5643,
        "urls": {
          "main": "/faab8d1c62771c9c39b855f4d4c07517b65eb8a7.png",
          "50x50": "/302ede188b480c5e6e2228c6efe4d36ecf227237.png",
          "origin": "/d31369f05ff8ca88c3239f940c1ed76df1a8514f.png"
        },
        "name": "ava.png",
        "site_id": 23,
        "mime": "image/png"
      },
      "credit": 0,
      "days_left": 0,
      "info": [
        {
          "company_id": 941,
          "campaign_id": 941,
          "formc_id": 941,
          "owner_id": 176,
          "user_id": 176,
          "is_paid": false,
          "company": "MAC",
          "role": 0
        }
      ]
    };
    
    beforeEach(() => {
      app.routers.navigate = sinon.stub(app.routers, 'navigate');
      inst.View = new Views.investment({
        model: new app.models.Company(model, fields),
        user: userData,
        fields: Object.assign({}, fields),
      });
      inst.View.render();
    });

    afterEach(() => {
      app.routers.navigate.restore();
      inst.View.undelegateEvents();
      $('#content').empty();
    });

    it('should send data to theh esign server', () => {
      const response = {
        "id": 842,
        "owner_id": 176,
        "company_id": 908,
        "campaign_id": 908,
        "amount": 1234,
        "number_of_shares": 0,
        "created_date": "2017-07-27T08:15:45.458960+00:00",
        "personal_information_data": {
          "city": "03330 Naves",
          "state": "",
          "country": "US",
          "zip_code": "03194",
          "last_name": "Chagin",
          "first_name": "Vladimir",
          "street_address_1": "Koltsova blvd 14d",
          "street_address_2": ""
        },
        "payment_information_type": 0,
        "payment_information_data": {
          "credit": 0,
          "account_number": "*****6789",
          "routing_number": "*****6789",
          "bank_account_type": false,
          "name_on_bank_account": "Vladimir Chagin"
        },
        "is_reviewed_educational_material": true,
        "is_understand_restrictions_to_cancel_investment": true,
        "is_understand_difficult_to_resell_purchashed": true,
        "is_understand_investing_is_risky": true,
        "is_understand_securities_related": true,
        "perk": "Test Describe the Perk 1",
        "status": 0,
        "alter_time": "2017-07-27T08:15:45.458960+00:00",
        "comission": 10,
        "add_deposit_to_csv": false,
        "deposit_csv_time": null,
        "deposit_confirmed_in_bofl_account": false,
        "deposit_confirmed_in_bofl_time": null,
        "deposit_cancelled_by_investor": false,
        "deposit_cancel_time": null,
        "cancellation_amount": 0,
        "add_withdrawal_to_csv": false,
        "withdrawal_csv_time": null,
        "withdrawal_confirmed_from_bofl_account": false,
        "withdrawal_time": null,
        "notes": "",
        "site_id": 4,
        "deposit_cancelled_by_manager": false,
        "deposit_cancel_time_manager": null,
        "deposit_transfer_to_issuer": false,
        "deposit_transfer_to_issuer_time": null,
        "cancelled_reason": "",
        "feedback": "",
        "rating": 0,
        "security_type": 1,
        "cap": 2,
        "percentage_revenue": 5,
        "campaign": {
          "header_image_data": [
            {
              "id": 4178,
              "mime": "image/jpeg",
              "name": "Header 11597x958.jpg",
              "urls": [
                "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/6ab03f175cf8f0cf311ef0ba32d07d738b191309.jpg"
              ]
            },
            {
              "id": 4176,
              "mime": "image/jpeg",
              "name": "Header 1.jpg",
              "urls": [
                "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/c42ab5ce49de72415054cdbb8b4b7cf9b490763a.jpg"
              ]
            }
          ],
          "minimum_raise": 50000,
          "expiration_date": "2017-08-20",
          "maximum_raise": 1000000,
          "minimum_increment": 500,
          "amount_raised": 29235,
          "investor_presentation_data": {
            "id": 4396,
            "mime": "application/msword",
            "name": "Монах, который продал свой Феррари -- Робин Шарма.doc",
            "urls": {
              "origin": "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com/a4756f61615009a05ea6bcec6e039de950dca3f1.doc"
            },
            "site_id": 23
          },
          "cap": 2
        },
        "company": {
          "id": 908,
          "name": "Revenue Share Company (Ratmir) 1",
          "slug": "test-legal-revenue-share-company-ratmir-1",
          "ga_id": "UA-97185485-4",
          "description": "111\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information.\r\nSome Text Information."
        },
        "formc": {
          "fiscal_recent_group_data": [
            {
              "id": 7474,
              "mime": "application/xml",
              "name": "bank_statement.xml",
              "urls": {
                "origin": "http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com/250796e5e9c4f27a721c45abd09b0294df7658c2.xml"
              }
            },
            {
              "id": 7475,
              "mime": "application/xml",
              "name": "bank_summary.xml",
              "urls": {
                "origin": "http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com/e61b1b87ba38eb194ca03572a411681e472af136.xml"
              }
            }
          ],
          "fiscal_prior_group_data": [
            {
              "id": 7473,
              "mime": "application/pdf",
              "name": "Scrum Guide.pdf",
              "urls": {
                "origin": "/6bc236a9a66d93725d852e2cee58b9d5850b13d6.pdf"
              },
              "site_id": 12
            }
          ],
          "link_to_formc": "http://www.dlink.ru/"
        }
      };
      const data = [
        {
          "compaign_id": 908,
          "type": 2,
          "object_id": 842,
          "meta_data": {
            "compaign_id": 908,
            "signature": "vc",
            "fees_to_investor": 10,
            "trans_percent": 6,
            "registration_fee": 500,
            "commitment_date_x": "7/27/2017",
            "issuer_legal_name": "Test Legal Revenue Share Company (Ratmir) 1",
            "city": "Test City 221",
            "state": "FL",
            "zip_code": "15003",
            "address_1": "Test Street Address 1",
            "address_2": "Test Optional Address 1",
            "jurisdiction_of_organization": "California",
            "maximum_raise": "1,000,000",
            "minimum_raise": "50,000",
            "price_per_share": "50,.61",
            "issuer_email": "ratmir.asanov.1@yandex.ru",
            "issuer_signer": "Ratmir Asanov",
            "investor_legal_name": "Vladimir Chagin",
            "aggregate_inclusive_purchase": "$1,244",
            "investment_amount": "1,234",
            "investor_address": "Koltsova blvd 14d",
            "investor_optional_address": "",
            "investor_code": "03194",
            "investor_city": "03330 Naves",
            "investor_state": "",
            "investor_email": "vladimir.chagin@gmail.com",
            "investor_number_purchased": 24.38253309622604
          },
          "template": "invest/participation_agreement.pdf"
        },
        {
          "compaign_id": 908,
          "type": 1,
          "object_id": 842,
          "meta_data": {
            "compaign_id": 908,
            "signature": "vc",
            "fees_to_investor": 10,
            "trans_percent": 6,
            "registration_fee": 500,
            "commitment_date_x": "7/27/2017",
            "issuer_legal_name": "Test Legal Revenue Share Company (Ratmir) 1",
            "city": "Test City 221",
            "state": "FL",
            "zip_code": "15003",
            "address_1": "Test Street Address 1",
            "address_2": "Test Optional Address 1",
            "jurisdiction_of_organization": "California",
            "maximum_raise": "1,000,000",
            "minimum_raise": "50,000",
            "price_per_share": "50,.61",
            "issuer_email": "ratmir.asanov.1@yandex.ru",
            "issuer_signer": "Ratmir Asanov",
            "investor_legal_name": "Vladimir Chagin",
            "aggregate_inclusive_purchase": "$1,244",
            "investment_amount": "1,234",
            "investor_address": "Koltsova blvd 14d",
            "investor_optional_address": "",
            "investor_code": "03194",
            "investor_city": "03330 Naves",
            "investor_state": "",
            "investor_email": "vladimir.chagin@gmail.com",
            "investor_number_purchased": 24.38253309622604
          },
          "template": "invest/subscription_agreement_revenue_share.pdf"
        }
      ];

      $('#amount').val('$1,234').keyup().change();
      $('#signature_full_name_input').val('vc');
      inst.View._updateTotalAmount();

      inst.View.saveEsign(response);

      expect(api.makeRequest.called).to.equal(true);
      expect(api.makeRequest.args[0][2]).to.deep.equal(data);
      expect(app.routers.navigate.called).to.equal(true);
    });
  });

});
